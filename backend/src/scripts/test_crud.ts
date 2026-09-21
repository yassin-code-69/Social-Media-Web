import { db } from "@/lib/db";
import {
  tasks,
  giftCodes,
  systemSettings,
  profiles,
  wallets,
} from "@/db/schema";
import { eq } from "drizzle-orm";

async function runDatabaseCrudAudit() {
  console.log("==================================================");
  console.log("🔍 STARTING SUPABASE DATABASE CRUD AUDIT");
  console.log("==================================================");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      failed++;
    }
  }

  try {
    // -------------------------------------------------------------
    // TEST SUITE 1: TASKS TABLE (INSERT, SELECT, UPDATE, DELETE)
    // -------------------------------------------------------------
    console.log("\n--- 1. Testing 'tasks' table CRUD ---");
    const testTaskTitle = `AUDIT_TASK_${Date.now()}`;
    const [insertedTask] = await db
      .insert(tasks)
      .values({
        title: testTaskTitle,
        description: "Audit test task verification description",
        platform: "YOUTUBE",
        action: "চ্যানেল সাবস্ক্রাইব করুন",
        targetUrl: "https://youtube.com/@digonto_test",
        rewardMinor: 250n, // ৳2.50
        dailyLimit: 50,
        status: "ACTIVE",
      })
      .returning();

    assert(!!insertedTask && !!insertedTask.id, "Task INSERT succeeded with returning ID");
    assert(insertedTask.title === testTaskTitle, "Task INSERT data integrity matches");

    // SELECT
    const [fetchedTask] = await db
      .select()
      .from(tasks)
      .where(eq(tasks.id, insertedTask.id));

    assert(!!fetchedTask && fetchedTask.id === insertedTask.id, "Task SELECT by ID succeeded");
    assert(fetchedTask.rewardMinor === 250n, "Task rewardMinor matches inserted value");

    // UPDATE
    const updatedTitle = `${testTaskTitle}_UPDATED`;
    const [updatedTask] = await db
      .update(tasks)
      .set({
        title: updatedTitle,
        rewardMinor: 500n, // ৳5.00
        status: "INACTIVE",
      })
      .where(eq(tasks.id, insertedTask.id))
      .returning();

    assert(updatedTask.title === updatedTitle, "Task UPDATE title succeeded");
    assert(updatedTask.rewardMinor === 500n, "Task UPDATE rewardMinor succeeded");
    assert(updatedTask.status === "INACTIVE", "Task UPDATE status succeeded");

    // DELETE
    await db.delete(tasks).where(eq(tasks.id, insertedTask.id));

    const [deletedTaskCheck] = await db
      .select()
      .from(tasks)
      .where(eq(tasks.id, insertedTask.id));

    assert(!deletedTaskCheck, "Task DELETE succeeded, record cleanly removed from DB");

    // -------------------------------------------------------------
    // TEST SUITE 2: GIFT CODES TABLE (INSERT, SELECT, UPDATE, DELETE)
    // -------------------------------------------------------------
    console.log("\n--- 2. Testing 'gift_codes' table CRUD ---");
    const testCode = `AUDIT_${Date.now().toString().slice(-6)}`;
    const [insertedGiftCode] = await db
      .insert(giftCodes)
      .values({
        code: testCode,
        rewardMinor: 1000n, // ৳10
        maxUses: 10,
        usedCount: 0,
        isActive: true,
      })
      .returning();

    assert(!!insertedGiftCode && insertedGiftCode.code === testCode, "GiftCode INSERT succeeded");

    // SELECT
    const [fetchedGiftCode] = await db
      .select()
      .from(giftCodes)
      .where(eq(giftCodes.id, insertedGiftCode.id));

    assert(fetchedGiftCode?.code === testCode, "GiftCode SELECT succeeded");

    // UPDATE
    const [updatedGiftCode] = await db
      .update(giftCodes)
      .set({
        maxUses: 25,
        isActive: false,
      })
      .where(eq(giftCodes.id, insertedGiftCode.id))
      .returning();

    assert(updatedGiftCode.maxUses === 25, "GiftCode UPDATE maxUses succeeded");
    assert(updatedGiftCode.isActive === false, "GiftCode UPDATE isActive succeeded");

    // DELETE
    await db.delete(giftCodes).where(eq(giftCodes.id, insertedGiftCode.id));

    const [deletedGiftCodeCheck] = await db
      .select()
      .from(giftCodes)
      .where(eq(giftCodes.id, insertedGiftCode.id));

    assert(!deletedGiftCodeCheck, "GiftCode DELETE succeeded, record cleanly removed from DB");

    // -------------------------------------------------------------
    // TEST SUITE 3: SYSTEM SETTINGS TABLE (INSERT, SELECT, UPDATE, DELETE)
    // -------------------------------------------------------------
    console.log("\n--- 3. Testing 'system_settings' table CRUD ---");
    const testKey = `audit_temp_${Date.now()}`;
    const [insertedSetting] = await db
      .insert(systemSettings)
      .values({
        key: testKey,
        value: { test: true, runTime: new Date().toISOString() },
        description: "Temporary audit test key",
      })
      .returning();

    assert(!!insertedSetting && insertedSetting.key === testKey, "SystemSetting INSERT succeeded");

    // UPDATE
    const [updatedSetting] = await db
      .update(systemSettings)
      .set({
        description: "Updated audit description",
      })
      .where(eq(systemSettings.key, testKey))
      .returning();

    assert(updatedSetting.description === "Updated audit description", "SystemSetting UPDATE succeeded");

    // DELETE
    await db.delete(systemSettings).where(eq(systemSettings.key, testKey));

    const [deletedSettingCheck] = await db
      .select()
      .from(systemSettings)
      .where(eq(systemSettings.key, testKey));

    assert(!deletedSettingCheck, "SystemSetting DELETE succeeded, record cleanly removed from DB");

    // -------------------------------------------------------------
    // TEST SUITE 4: PROFILES & WALLETS JOIN INTEGRITY
    // -------------------------------------------------------------
    console.log("\n--- 4. Testing 'profiles' & 'wallets' Data Integrity ---");
    const liveProfiles = await db.select().from(profiles);
    assert(liveProfiles.length > 0, `Profiles table has live records (found: ${liveProfiles.length})`);

    const liveWallets = await db.select().from(wallets);
    assert(liveWallets.length > 0, `Wallets table has live records (found: ${liveWallets.length})`);

    const userWithWallet = await db
      .select({
        profileId: profiles.id,
        displayName: profiles.displayName,
        walletId: wallets.id,
        balanceMinor: wallets.balanceMinor,
      })
      .from(profiles)
      .innerJoin(wallets, eq(profiles.id, wallets.userId))
      .limit(1);

    assert(userWithWallet.length > 0, "Profile and Wallet INNER JOIN relationship is 100% intact");
    if (userWithWallet.length > 0) {
      console.log(`   Sample User: "${userWithWallet[0].displayName}" | Balance Minor: ${userWithWallet[0].balanceMinor}`);
    }

    // -------------------------------------------------------------
    // AUDIT SUMMARY
    // -------------------------------------------------------------
    console.log("\n==================================================");
    console.log(`🏁 DATABASE CRUD AUDIT FINISHED:`);
    console.log(`   Total Passed: ${passed}`);
    console.log(`   Total Failed: ${failed}`);
    console.log("==================================================");

    if (failed > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (error) {
    console.error("❌ CRITICAL DATABASE ERROR DURING AUDIT:", error);
    process.exit(1);
  }
}

runDatabaseCrudAudit();

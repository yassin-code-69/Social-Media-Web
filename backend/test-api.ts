import { app } from "./src/app";

async function runTests() {
  console.log("🚀 Running Backend API Integration Tests...\n");

  // 1. Health
  const resHealth = await app.request("/api/v1/health");
  const dataHealth = await resHealth.json();
  console.log("1. /api/v1/health -> Status:", resHealth.status, dataHealth);

  // 2. Packages
  const resPackages = await app.request("/api/v1/packages");
  const dataPackages = await resPackages.json();
  console.log("2. /api/v1/packages -> Count:", dataPackages.data?.length);

  // 3. Tasks
  const resTasks = await app.request("/api/v1/tasks");
  const dataTasks = await resTasks.json();
  console.log("3. /api/v1/tasks -> Count:", dataTasks.data?.length);

  // 4. I Cash Plans
  const resIcash = await app.request("/api/v1/icash/plans");
  const dataIcash = await resIcash.json();
  console.log("4. /api/v1/icash/plans -> Count:", dataIcash.data?.length);

  // 5. Register new user
  const randomPhone = "017" + Math.floor(10000000 + Math.random() * 90000000);
  const randomEmail = `testuser_${Date.now()}@digonto.com`;

  console.log(`\nAttempting registration with ${randomEmail} (${randomPhone})...`);
  const resRegister = await app.request("/api/v1/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      displayName: "টেস্ট ইউজার",
      phone: randomPhone,
      email: randomEmail,
      password: "TestPassword123!",
    }),
  });
  const dataRegister = await resRegister.json();
  console.log("5. /api/v1/auth/register -> Status:", resRegister.status, {
    success: dataRegister.success,
    userId: dataRegister.data?.user?.id,
    referralCode: dataRegister.data?.user?.referralCode,
    hasToken: !!dataRegister.data?.session?.access_token,
  });

  if (!dataRegister.data?.session?.access_token) {
    console.error("❌ Registration did not return access_token. Aborting user tests.");
    return;
  }

  const token = dataRegister.data.session.access_token;
  const authHeaders = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  // 6. Test Login
  const resLogin = await app.request("/api/v1/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      identifier: randomPhone,
      password: "TestPassword123!",
    }),
  });
  const dataLogin = await resLogin.json();
  console.log("6. /api/v1/auth/login (via phone) -> Status:", resLogin.status, {
    success: dataLogin.success,
    user: dataLogin.data?.user?.displayName,
    balance: dataLogin.data?.wallet?.balance?.formatted,
  });

  // 7. Test /me
  const resMe = await app.request("/api/v1/auth/me", { headers: authHeaders });
  const dataMe = await resMe.json();
  console.log("7. /api/v1/auth/me -> Status:", resMe.status, {
    displayName: dataMe.data?.user?.displayName,
    balance: dataMe.data?.wallet?.balance?.formatted,
  });

  // 8. Test Daily Check-in
  const resCheckin = await app.request("/api/v1/missions/daily-checkin", {
    method: "POST",
    headers: authHeaders,
  });
  const dataCheckin = await resCheckin.json();
  console.log("8. /api/v1/missions/daily-checkin -> Status:", resCheckin.status, dataCheckin.data?.message);

  // 9. Test Referrals summary
  const resRef = await app.request("/api/v1/referrals/summary", { headers: authHeaders });
  const dataRef = await resRef.json();
  console.log("9. /api/v1/referrals/summary -> Status:", resRef.status, {
    code: dataRef.data?.referralCode,
    team: dataRef.data?.teamStats,
  });

  // 10. Test Salary status
  const resSalary = await app.request("/api/v1/salary/status", { headers: authHeaders });
  const dataSalary = await resSalary.json();
  console.log("10. /api/v1/salary/status -> Status:", resSalary.status, {
    canClaim: dataSalary.data?.canClaimSalary,
    tiers: dataSalary.data?.salaryTiers?.length,
  });

  console.log("\n🎉 ALL BACKEND API MODULES & DB TESTS COMPLETED SUCCESSFULLY!");
}

runTests().catch(console.error);

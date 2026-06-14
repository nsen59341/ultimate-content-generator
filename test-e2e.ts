import { HistoryItem, Platform } from "./types";

async function runEndToEndTests() {
  const BASE_URL = "http://localhost:3000";
  console.log("=== STARTING END-TO-END INTEGRATION TESTING ===");
  console.log(`Connecting to server at ${BASE_URL}...`);

  try {
    // 1. Test Health Check
    console.log("\n[TEST 1] Verifying backend health...");
    const healthRes = await fetch(`${BASE_URL}/api/health`);
    if (!healthRes.ok) throw new Error("Health check failed");
    const healthData = await healthRes.json();
    console.log("Health check response:", healthData);
    if (healthData.status !== "ok") throw new Error("Invalid health check status");
    console.log("✅ Test 1 Passed: Server is healthy and responsive!");

    // 2. Test Get History
    console.log("\n[TEST 2] Fetching initial history logs from database...");
    const initialHistRes = await fetch(`${BASE_URL}/api/history`);
    if (!initialHistRes.ok) throw new Error("Get history failed");
    const initialHistory = await initialHistRes.json();
    console.log(`Initial history count: ${initialHistory.length}`);
    console.log("✅ Test 2 Passed: Read operations from database succeed!");

    // 3. Test Save/Upsert History Item
    console.log("\n[TEST 3] Creating and saving a mock compilation history log...");
    const mockId = `test_item_${Date.now()}`;
    const mockItem: HistoryItem = {
      id: mockId,
      sourceInput: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      cardData: {
        title: "Never Gonna Give You Up (Refactored)",
        type: "YouTube",
        duration: "3:32",
        summary: "An iconic digital asset exploring commitment, fidelity, and online meme vectors of the late 2000s onwards."
      },
      impactSummary: "An unshakeable pillar of modern internet culture.",
      fullContent: "FULL DIGITAL CONTENT OF THE HISTORICAL MEME",
      preferences: {
        complexity: "complex",
        tone: "technical",
        length: "medium",
        audience: "Netizens",
        customInstructions: "Roll with it."
      },
      generations: [
        {
          platform: Platform.LinkedIn,
          content: "Why commitment is your greatest competitive advantage in B2B tech sales..."
        }
      ],
      createdAt: new Date().toISOString()
    };

    const saveRes = await fetch(`${BASE_URL}/api/history`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item: mockItem })
    });
    if (!saveRes.ok) throw new Error("Saving history item failed");
    const saveResult = await saveRes.json();
    console.log("Save status response:", saveResult);
    console.log("✅ Test 3 Passed: Persistent file database serialization succeeded!");

    // 4. Verify Retrieval of New Log
    console.log("\n[TEST 4] Re-fetching history logs to verify the database saved our mock item...");
    const verifyHistRes = await fetch(`${BASE_URL}/api/history`);
    const verifyHistory = (await verifyHistRes.json()) as HistoryItem[];
    const savedItem = verifyHistory.find((item) => item.id === mockId);
    
    if (!savedItem) {
      throw new Error("Saved history item could not be retrieved from the database!");
    }
    console.log("Verified database record title:", savedItem.cardData.title);
    console.log("Verified generations appended:", savedItem.generations.map(g => g.platform).join(", "));
    console.log("✅ Test 4 Passed: Upserted log present in history database query!");

    // 5. Test Delete Log
    console.log("\n[TEST 5] Deleting the test log from history...");
    const deleteRes = await fetch(`${BASE_URL}/api/history/${mockId}`, {
      method: "DELETE"
    });
    if (!deleteRes.ok) throw new Error("Delete failed");
    console.log("Delete status response:", await deleteRes.json());

    // 6. Confirm Deletion
    const finalHistRes = await fetch(`${BASE_URL}/api/history`);
    const finalHistory = (await finalHistRes.json()) as HistoryItem[];
    const purgedItem = finalHistory.find((item) => item.id === mockId);
    if (purgedItem) {
      throw new Error("History item was not purged from database on delete!");
    }
    console.log("✅ Test 5 & 6 Passed: History log deletion & purge audit is fully clean!");

    console.log("\n=========================================");
    console.log("💯 ALL INTEGRATION TESTS PASSED SUCCESSFULLY! 💯");
    console.log("The Content Repurposer Database History layer is 100% functional.");
    console.log("=========================================");
  } catch (error) {
    console.error("\n❌ E2E INTEGRATION TEST FAILURE:", error);
    process.exit(1);
  }
}

// Run the suite
runEndToEndTests();

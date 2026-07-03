import java.util.HashMap;
import java.util.Map;

public class WalletAdmin {
    // Memory Data Persistence Structuring
    private final String adminUser = "jupiter";
    private final String adminPass = "1234567owner";
    private final Map<String, Double> userLedger;
    private boolean isAuthenticated = false;

    public WalletAdmin() {
        this.userLedger = new HashMap<>();
        // Optional initialization mock data seeds
        this.userLedger.put("alice", 150.00);
        this.userLedger.put("bob", 45.50);
    }

    // Security Gate Verification Logic
    public boolean authenticate(String username, String password) {
        if (this.adminUser.equals(username) && this.adminPass.equals(password)) {
            this.isAuthenticated = true;
            return true;
        }
        return false;
    }

    public void terminateSession() {
        this.isAuthenticated = false;
    }

    // Direct Cash Balance Injections
    public String injectFunds(String targetUser, double amount) {
        if (!isAuthenticated) return "Error: Administrative access required.";
        String userKey = targetUser.toLowerCase().trim();
        
        if (!userLedger.containsKey(userKey)) {
            return "Execution Error: Target profile '" + targetUser + "' not found.";
        }
        
        double updatedBalance = userLedger.get(userKey) + amount;
        userLedger.put(userKey, updatedBalance);
        return "Success: Added $" + amount + " to " + userKey + ". Current Balance: $" + updatedBalance;
    }

    // Direct Cash Balance Deductions
    public String confiscateFunds(String targetUser, double amount) {
        if (!isAuthenticated) return "Error: Administrative access required.";
        String userKey = targetUser.toLowerCase().trim();
        
        if (!userLedger.containsKey(userKey)) {
            return "Execution Error: Target profile '" + targetUser + "' not found.";
        }
        
        double updatedBalance = userLedger.get(userKey) - amount;
        userLedger.put(userKey, updatedBalance);
        return "Success: Subtracted $" + amount + " from " + userKey + ". Current Balance: $" + updatedBalance;
    }

    // Onboard New Accounts Into System Memory Map
    public String registerNewUser(String username, double startingDeposit) {
        if (!isAuthenticated) return "Error: Administrative access required.";
        String userKey = username.toLowerCase().trim();
        
        if (userLedger.containsKey(userKey) || this.adminUser.equals(userKey)) {
            return "Registration Error: User entry duplicate matched.";
        }
        
        userLedger.put(userKey, startingDeposit);
        return "Success: Initialized user wallet profile for '" + userKey + "' with $" + startingDeposit;
    }

    // Returns Data Structures Directly to Presentation Shell
    public Map<String, Double> fetchActiveLedger() {
        return this.userLedger;
    }
}

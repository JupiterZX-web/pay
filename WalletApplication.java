package com.wallet;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.Map;
import java.util.List;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@SpringBootApplication
public class WalletApplication {
    public static void main(String[] args) {
        SpringApplication.run(WalletApplication.class, args);
    }
}

@RestController
@RequestMapping("/api/wallet")
@CrossOrigin(origins = "*")
class WalletController {

    private final String adminUser = "jupiter";
    private final String adminPass = "1234567owner";

    // In-memory simulated H2 local relational databases
    private final Map<String, Double> ledgerDb = new ConcurrentHashMap<>();
    private final List<String> activityLogs = new CopyOnWriteArrayList<>();
    private final DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm:ss");

    public WalletController() {
        // Pre-hydrate mock database seeds
        ledgerDb.put("alice", 2500.00);
        ledgerDb.put("bob", 420.50);
        logAction("SYSTEM", "Database initialized with baseline ledger seeds.");
    }

    private void logAction(String identity, String operation) {
        String timestamp = LocalDateTime.now().format(timeFormatter);
        activityLogs.add(0, "[" + timestamp + "] " + identity.toUpperCase() + ": " + operation);
    }

    @PostMapping("/login")
    public ResponseEntity<String> authenticateOperator(@RequestParam String username, @RequestParam String password) {
        if (adminUser.equals(username) && adminPass.equals(password)) {
            logAction("SECURITY", "Operator '" + username + "' established secure connection.");
            return ResponseEntity.ok("Authorized");
        }
        logAction("SECURITY", "Failed login attempt targeting profile: " + username);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Access Denied: Signature mismatch.");
    }

    @GetMapping("/ledger")
    public Map<String, Double> getActiveLedger() {
        return ledgerDb;
    }

    @GetMapping("/logs")
    public List<String> getActivityLogs() {
        return activityLogs;
    }

    @PostMapping("/create")
    public ResponseEntity<String> createUserProfile(@RequestParam String username, @RequestParam double balance) {
        String cleanName = username.toLowerCase().trim();
        if (cleanName.isEmpty()) return ResponseEntity.badRequest().body("Error: Invalid name string.");
        if (ledgerDb.containsKey(cleanName) || cleanName.equals(adminUser)) {
            return ResponseEntity.badRequest().body("Error: Profile mapping conflict.");
        }
        ledgerDb.put(cleanName, balance);
        logAction("LEDGER", "Created wallet profile '" + cleanName + "' with starting capital $" + balance);
        return ResponseEntity.ok("Success: Onboarded " + cleanName);
    }

    @PostMapping("/add")
    public ResponseEntity<String> addMoneyToWallet(@RequestParam String username, @RequestParam double amount) {
        String cleanName = username.toLowerCase().trim();
        if (!ledgerDb.containsKey(cleanName)) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: Profile missing.");
        if (amount <= 0) return ResponseEntity.badRequest().body("Error: Magnitudes must be positive.");
        
        ledgerDb.put(cleanName, ledgerDb.get(cleanName) + amount);
        logAction("MODIFIER", "Injected $" + amount + " into user '" + cleanName + "' balance framework.");
        return ResponseEntity.ok("Injected $" + amount + " successfully.");
    }

    @PostMapping("/take")
    public ResponseEntity<String> takeMoneyFromWallet(@RequestParam String username, @RequestParam double amount) {
        String cleanName = username.toLowerCase().trim();
        if (!ledgerDb.containsKey(cleanName)) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: Profile missing.");
        if (amount <= 0) return ResponseEntity.badRequest().body("Error: Magnitudes must be positive.");
        
        ledgerDb.put(cleanName, ledgerDb.get(cleanName) - amount);
        logAction("MODIFIER", "Confiscated $" + amount + " from user '" + cleanName + "' structural holdings.");
        return ResponseEntity.ok("Confiscated $" + amount + " successfully.");
    }
}

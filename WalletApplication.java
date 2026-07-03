package com.wallet;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

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

    // Target Admin Configuration Properties
    private final String adminUser = "jupiter";
    private final String adminPass = "1234567owner";

    // In-memory data store
    private final Map<String, Double> ledgerDb = new ConcurrentHashMap<>();

    public WalletController() {
        ledgerDb.put("alice", 2500.00);
        ledgerDb.put("bob", 420.50);
    }

    // NEW: Secure Server-Side Authentication End-Point
    @PostMapping("/login")
    public ResponseEntity<String> authenticateOperator(@RequestParam String username, @RequestParam String password) {
        if (adminUser.equals(username) && adminPass.equals(password)) {
            return ResponseEntity.ok("Authentication successful.");
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Access Denied: Invalid credentials.");
    }

    @GetMapping("/ledger")
    public Map<String, Double> getActiveLedger() {
        return ledgerDb;
    }

    @PostMapping("/create")
    public String createUserProfile(@RequestParam String username, @RequestParam double balance) {
        String cleanName = username.toLowerCase().trim();
        if (cleanName.isEmpty()) return "Error: Invalid username payload.";
        if (ledgerDb.containsKey(cleanName) || cleanName.equals(adminUser)) {
            return "Registration Halted: Entity workspace already exists.";
        }
        ledgerDb.put(cleanName, balance);
        return "Success: " + cleanName + " onboarded with starting capital.";
    }

    @PostMapping("/add")
    public String addMoneyToWallet(@RequestParam String username, @RequestParam double amount) {
        String cleanName = username.toLowerCase().trim();
        if (!ledgerDb.containsKey(cleanName)) return "Rejection: Customer account record missing.";
        if (amount <= 0) return "Failed: Value metric must be a non-zero positive number.";
        
        ledgerDb.put(cleanName, ledgerDb.get(cleanName) + amount);
        return "Success: Deposited $" + amount + " into " + cleanName + "'s balance ledger.";
    }

    @PostMapping("/take")
    public String takeMoneyFromWallet(@RequestParam String username, @RequestParam double amount) {
        String cleanName = username.toLowerCase().trim();
        if (!ledgerDb.containsKey(cleanName)) return "Rejection: Customer account record missing.";
        if (amount <= 0) return "Failed: Value metric must be a non-zero positive number.";
        
        ledgerDb.put(cleanName, ledgerDb.get(cleanName) - amount);
        return "Success: Deducted $" + amount + " from " + cleanName + "'s balance ledger.";
    }
}

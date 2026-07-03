package com.wallet;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
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
@CrossOrigin(origins = "*") // Allows communication between frontend and framework components
class WalletController {

    // Thread-safe persistence simulation storage map
    private final Map<String, Double> ledgerDb = new ConcurrentHashMap<>();

    // Inline constructor automatically plants starting client balance sets
    public WalletController() {
        ledgerDb.put("alice", 2500.00);
        ledgerDb.put("bob", 420.50);
    }

    @GetMapping("/ledger")
    public Map<String, Double> getActiveLedger() {
        return ledgerDb;
    }

    @PostMapping("/create")
    public String createUserProfile(@RequestParam String username, @RequestParam double balance) {
        String cleanName = username.toLowerCase().trim();
        if (cleanName.isEmpty()) return "Error: Invalid username payload string.";
        if (ledgerDb.containsKey(cleanName) || cleanName.equals("jupiter")) {
            return "Registration Halted: Target entity workspace already exists.";
        }
        ledgerDb.put(cleanName, balance);
        return "Success: " + cleanName + " verified and onboarded with starting capital.";
    }

    @PostMapping("/add")
    public String addMoneyToWallet(@RequestParam String username, @RequestParam double amount) {
        String cleanName = username.toLowerCase().trim();
        if (!ledgerDb.containsKey(cleanName)) return "Execution Rejection: Customer account record missing.";
        if (amount <= 0) return "Failed: Value metric must be a non-zero positive number.";
        
        ledgerDb.put(cleanName, ledgerDb.get(cleanName) + amount);
        return "Success: Deposited $" + amount + " into " + cleanName + "'s balance ledger.";
    }

    @PostMapping("/take")
    public String takeMoneyFromWallet(@RequestParam String username, @RequestParam double amount) {
        String cleanName = username.toLowerCase().trim();
        if (!ledgerDb.containsKey(cleanName)) return "Execution Rejection: Customer account record missing.";
        if (amount <= 0) return "Failed: Value metric must be a non-zero positive number.";
        
        // Allows direct overdraft modifications down into negative numbers
        ledgerDb.put(cleanName, ledgerDb.get(cleanName) - amount);
        return "Success: Deducted $" + amount + " from " + cleanName + "'s balance ledger.";
    }
}

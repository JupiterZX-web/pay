import java.util.Map;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        WalletAdmin systemCore = new WalletAdmin();
        Scanner commandInput = new Scanner(System.in);
        
        System.out.println("=========================================");
        System.out.println("   E-WALLET ADMINISTRATIVE GATEWAY       ");
        System.out.println("=========================================");
        
        // Loop Until Secure Credentials Match
        while (true) {
            System.out.print("Enter Admin Username: ");
            String user = commandInput.nextLine();
            System.out.print("Enter Admin Password: ");
            String pass = commandInput.nextLine();
            
            if (systemCore.authenticate(user, pass)) {
                System.out.println("\n[SECURE CONNECTION INSTANTIATED SUCCESSFULLY]\n");
                break;
            }
            System.out.println("Access Denied: Invalid credentials. Re-evaluate parameters.\n");
        }

        // Dashboard Command Loop Workflow 
        boolean activeSession = true;
        while (activeSession) {
            System.out.println("\n--- MAIN CONTROL PANEL ---");
            System.out.println("1. Create New Wallet Profile");
            System.out.println("2. Add Money to User");
            System.out.println("3. Take Money from User");
            System.out.println("4. Audit Ledger Database");
            System.out.println("5. Exit Secure Portal");
            System.out.print("Select Operational Vector (1-5): ");
            
            String operationalChoice = commandInput.nextLine();
            switch (operationalChoice) {
                case "1":
                    System.out.print("Enter New Client Username: ");
                    String newUser = commandInput.nextLine();
                    System.out.print("Enter Starting Capital Deposit Amount: ");
                    double initialDeposit = Double.parseDouble(commandInput.nextLine());
                    System.out.println(systemCore.registerNewUser(newUser, initialDeposit));
                    break;
                    
                case "2":
                    System.out.print("Target Client Username: ");
                    String depositTarget = commandInput.nextLine();
                    System.out.print("Amount to Inject ($): ");
                    double addVal = Double.parseDouble(commandInput.nextLine());
                    System.out.println(systemCore.injectFunds(depositTarget, addVal));
                    break;
                    
                case "3":
                    System.out.print("Target Client Username: ");
                    String extractionTarget = commandInput.nextLine();
                    System.out.print("Amount to Confiscate ($): ");
                    double subVal = Double.parseDouble(commandInput.nextLine());
                    System.out.println(systemCore.confiscateFunds(extractionTarget, subVal));
                    break;
                    
                case "4":
                    System.out.println("\nCURRENT SYSTEM BALANCES AUDIT:");
                    System.out.println("---------------------------------");
                    for (Map.Entry<String, Double> row : systemCore.fetchActiveLedger().entrySet()) {
                        System.out.printf("Account Holder: %-12s | Holdings Ledger: $%.2f\n", row.getKey(), row.getValue());
                    }
                    System.out.println("---------------------------------");
                    break;
                    
                case "5":
                    systemCore.terminateSession();
                    activeSession = false;
                    System.out.println("Secure session terminated. Logging out.");
                    break;
                    
                default:
                    System.out.println("Invalid selection token. Choose 1 through 5.");
            }
        }
        commandInput.close();
    }
}

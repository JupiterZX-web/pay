<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>E-Wallet Admin Dashboard</title>
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        body {
            background-color: #f4f6f9;
            color: #333;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 20px;
        }

        .container {
            width: 100%;
            max-width: 900px;
            background: #fff;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }

        h1, h2 {
            margin-bottom: 20px;
            color: #2c3e50;
        }

        /* Login Screen Style */
        .login-screen {
            max-width: 400px;
            margin: 0 auto;
            text-align: center;
        }

        /* Hidden Utility Class */
        .hidden {
            display: none !important;
        }

        /* Form elements */
        .form-group {
            margin-bottom: 15px;
            text-align: left;
        }

        label {
            display: block;
            margin-bottom: 5px;
            font-weight: 600;
            font-size: 14px;
        }

        input {
            width: 100%;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 6px;
            font-size: 16px;
        }

        button {
            width: 100%;
            padding: 12px;
            background-color: #3498db;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            transition: background 0.2s;
        }

        button:hover {
            background-color: #2980b9;
        }

        /* Dashboard layouts */
        .dashboard-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #eee;
            padding-bottom: 15px;
            margin-bottom: 25px;
        }

        .logout-btn {
            width: auto;
            padding: 8px 15px;
            background-color: #e74c3c;
        }
        .logout-btn:hover {
            background-color: #c0392b;
        }

        .grid-layout {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 25px;
        }

        @media (max-width: 768px) {
            .grid-layout {
                grid-template-columns: 1fr;
            }
        }

        /* Panels and actions */
        .panel {
            background: #fdfdfd;
            border: 1px solid #eef2f5;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.02);
        }

        .action-buttons {
            display: flex;
            gap: 10px;
            margin-top: 10px;
        }

        .btn-add { background-color: #2ecc71; }
        .btn-add:hover { background-color: #27ae60; }
        .btn-take { background-color: #e67e22; }
        .btn-take:hover { background-color: #d35400; }

        /* Data Tables */
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }

        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }

        th {
            background-color: #f8f9fa;
            font-weight: 600;
        }

        /* Notifications styling */
        .toast {
            margin-bottom: 15px;
            padding: 12px;
            border-radius: 6px;
            font-weight: 500;
            text-align: center;
        }
        .toast-success { background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .toast-error { background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
    </style>
</head>
<body>

    <div class="container">
        <!-- LOG-IN VIEW -->
        <div id="loginView" class="login-screen">
            <h1>Admin Gateway</h1>
            <div id="loginToast" class="toast hidden"></div>
            <div class="form-group">
                <label for="username">Username</label>
                <input type="text" id="username" placeholder="Enter username...">
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" placeholder="Enter password...">
            </div>
            <button onclick="handleLogin()">Authenticate Account</button>
        </div>

        <!-- MAIN DASHBOARD VIEW -->
        <div id="dashboardView" class="hidden">
            <div class="dashboard-header">
                <div>
                    <h1>E-Wallet Control Hub</h1>
                    <p>Logged in as: <strong id="adminDisplay"></strong> (Owner)</p>
                </div>
                <button class="logout-btn" onclick="handleLogout()">Log Out</button>
            </div>

            <div id="dashboardToast" class="toast hidden"></div>

            <div class="grid-layout">
                <!-- User Initialization Form -->
                <div class="panel">
                    <h2>Register New Account</h2>
                    <div class="form-group">
                        <label for="newUsername">Client Username</label>
                        <input type="text" id="newUsername" placeholder="e.g. alice">
                    </div>
                    <div class="form-group">
                        <label for="newBalance">Starting Deposit ($)</label>
                        <input type="number" id="newBalance" value="0" min="0" step="0.01">
                    </div>
                    <button onclick="registerUser()">Create Wallet Account</button>
                </div>

                <!-- Fund Modification Engine -->
                <div class="panel">
                    <h2>Balance Adjustment Engine</h2>
                    <div class="form-group">
                        <label for="targetUser">Target Client Username</label>
                        <input type="text" id="targetUser" placeholder="e.g. alice">
                    </div>
                    <div class="form-group">
                        <label for="actionAmount">Transaction Amount ($)</label>
                        <input type="number" id="actionAmount" min="0.01" step="0.01" placeholder="0.00">
                    </div>
                    <div class="action-buttons">
                        <button class="btn-add" onclick="modifyFunds('add')">Add Money</button>
                        <button class="btn-take" onclick="modifyFunds('take')">Take Money</button>
                    </div>
                </div>
            </div>

            <!-- Global Balance Ledger Ledger -->
            <div class="panel" style="margin-top: 25px;">
                <h2>System Ledger Overview</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Current Capital Holding</th>
                        </tr>
                    </thead>
                    <tbody id="ledgerBody">
                        <!-- Instantiated at runtime by JavaScript -->
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <script>
        // Internal System Database Simulation State
        const walletDatabase = {
            ownerCredentials: { username: "jupiter", password: "1234567owner" },
            wallets: {
                "alice": 250.00,
                "bob": 75.00
            }
        };

        // Authentication Controller
        function handleLogin() {
            const userIn = document.getElementById('username').value.trim();
            const passIn = document.getElementById('password').value;
            const loginToast = document.getElementById('loginToast');

            if (userIn === walletDatabase.ownerCredentials.username && passIn === walletDatabase.ownerCredentials.password) {
                // Clear UI status flags
                loginToast.classList.add('hidden');
                
                // Toggle Application Screens
                document.getElementById('loginView').classList.add('hidden');
                document.getElementById('dashboardView').classList.remove('hidden');
                document.getElementById('adminDisplay').innerText = userIn;
                
                // Clear validation fields and draw table
                document.getElementById('username').value = "";
                document.getElementById('password').value = "";
                updateLedgerUI();
            } else {
                showToast('loginToast', 'Authentication failed. Check your credential parameters.', 'error');
            }
        }

        function handleLogout() {
            document.getElementById('dashboardView').classList.add('hidden');
            document.getElementById('loginView').classList.remove('hidden');
        }

        // Account Registration Module
        function registerUser() {
            const usernameInput = document.getElementById('newUsername');
            const balanceInput = document.getElementById('newBalance');
            const username = usernameInput.value.trim().toLowerCase();
            const startingBalance = parseFloat(balanceInput.value);

            if (!username) {
                showToast('dashboardToast', 'Please enter a valid username.', 'error');
                return;
            }
            if (walletDatabase.wallets.hasOwnProperty(username) || username === 'jupiter') {

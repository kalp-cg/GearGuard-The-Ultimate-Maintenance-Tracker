const http = require('http');

function post(data) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: '/api/auth/register',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => resolve({ status: res.statusCode, body }));
        });

        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

async function run() {
    try {
        console.log("Testing ADMIN registration...");
        const adminRes = await post(JSON.stringify({
            email: `test_admin_${Date.now()}@test.com`,
            password: "password123",
            firstName: "Test",
            lastName: "Admin",
            role: "ADMIN"
        }));
        console.log("ADMIN Status:", adminRes.status);
        if (adminRes.status === 403) {
            console.log("PASS: Admin registration blocked.");
        } else {
            console.log("FAIL: Admin registration NOT blocked. Body:", adminRes.body);
        }

        console.log("\nTesting MANAGER registration...");
        const managerRes = await post(JSON.stringify({
            email: `test_manager_${Date.now()}@test.com`,
            password: "password123",
            firstName: "Test",
            lastName: "Manager",
            role: "MANAGER"
        }));
        console.log("MANAGER Status:", managerRes.status);
        if (managerRes.status === 403) {
            console.log("PASS: Manager registration blocked.");
        } else {
            console.log("FAIL: Manager registration NOT blocked. Body:", managerRes.body);
        }

    } catch (e) {
        console.error(e);
    }
}

run();

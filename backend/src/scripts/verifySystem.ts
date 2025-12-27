import axios from 'axios';

const API_URL = 'http://localhost:5000/api';
const ADMIN_CREDENTIALS = {
    email: 'admin@gearguard.com',
    password: 'password123'
};

/* Color helpers */
const green = (text: string) => `\x1b[32m${text}\x1b[0m`;
const red = (text: string) => `\x1b[31m${text}\x1b[0m`;
const cyan = (text: string) => `\x1b[36m${text}\x1b[0m`;

async function verifySystem() {
    console.log(cyan('\n🔍 Starting System Verification...'));
    let token = '';

    // 1. Authentication
    try {
        console.log('1. Testing Authentication...');
        const authRes = await axios.post(`${API_URL}/auth/login`, ADMIN_CREDENTIALS);
        token = authRes.data.token;
        if (!token) throw new Error('No token received');
        console.log(green('   ✅ Login Successful'));
    } catch (error: any) {
        console.error(red('   ❌ Login Failed: ' + (error.response?.data?.error || error.message)));
        process.exit(1);
    }

    const headers = { Authorization: `Bearer ${token}` };

    // 2. Equipment
    try {
        console.log('2. Testing Equipment API...');
        const res = await axios.get(`${API_URL}/equipment`, { headers });
        console.log(green(`   ✅ Listing Equipment: Found ${res.data.equipment?.length} items`));
    } catch (error: any) {
        console.error(red('   ❌ Equipment List Failed: ' + error.message));
    }

    // 3. Teams
    try {
        console.log('3. Testing Teams API...');
        const res = await axios.get(`${API_URL}/teams`, { headers });
        console.log(green(`   ✅ Listing Teams: Found ${res.data.teams?.length} items`));
    } catch (error: any) {
        console.error(red('   ❌ Teams List Failed: ' + error.message));
    }

    // 4. Requests (All Types)
    try {
        console.log('4. Testing Requests API...');
        const res = await axios.get(`${API_URL}/requests`, { headers });
        console.log(green(`   ✅ Listing Requests: Found ${res.data.requests?.length || 0} items`));

        // Kanban
        const kanban = await axios.get(`${API_URL}/requests/kanban`, { headers });
        console.log(green(`   ✅ Kanban Data: ${Object.keys(kanban.data.kanban || {}).length} columns`));

        // Reports
        const reports = await axios.get(`${API_URL}/requests/reports/pivot`, { headers });
        console.log(green(`   ✅ Reporting Data: Loaded`));

    } catch (error: any) {
        console.error(red('   ❌ Requests Check Failed: ' + error.message));
    }

    // 5. Users
    try {
        // Assuming there's a way to list users or we just check profile
        // Since we don't have a direct list users endpoint exposed to all, we check auth profile if available
        // But we can check Department listing which is often admin only
        console.log('5. Testing Departments API...');
        const res = await axios.get(`${API_URL}/departments`, { headers });
        console.log(green(`   ✅ Listing Departments: Found ${res.data.length} items`));
    } catch (error: any) {
        console.error(red('   ❌ Departments List Failed: ' + error.message));
    }

    console.log(cyan('\n✨ Verification Complete\n'));
}

verifySystem();

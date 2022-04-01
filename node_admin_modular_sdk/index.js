const { initializeApp, applicationDefault } = require('firebase-admin/app');
const {
    getAuth
} = require('firebase-admin/auth');

const config = {
    credential: applicationDefault(),
}

const app = initializeApp(config);

const getProjectConfig = () => {
    getAuth().projectConfigManager().getProjectConfig()
        .then((response) => {
            if (response.recaptchaConfig != undefined) {
                console.log('Project reCAPTCHA config: ', response.recaptchaConfig.toJSON());
            } else {
                console.log('Project does not have reCAPTCHA config enabled');
            }
        }).catch((error) => {
            console.log('Error getting project config:', error);
        });
}

// Update project config with reCAPTCHA config
const updateProjectConfigRequest = {
    recaptchaConfig: {
        emailPasswordEnforcementState: 'AUDIT',
        managedRules: [{
            endScore: 0.3,
            action: 'UNSPECIFIED'
        }, {
            endScore: 0.4,
            action: 'BLOCK'
        }],
    }
};
const updateProjectConfigWithRecaptcha = () => {
    getAuth().projectConfigManager().updateProjectConfig(updateProjectConfigRequest).then((response) => {
        console.log('Updated reCAPTCHA config for project: ', response.recaptchaConfig.toJSON());
    }).catch((error) => {
        console.log('Error updating project config:', error);
    });
}

// Update Tenant
const updateTenantRequest = {
    recaptchaConfig: {
        emailPasswordEnforcementState: 'OFF',
        managedRules: [{
            endScore: 0.3,
            action: 'RECAPTCHA_ACTION_UNSPECIFIED'
        }, {
            endScore: 0.4,
            action: 'RECAPTCHA_ACTION_UNSPECIFIED'
        },
        {
            endScore: 0.4,
            action: 'BLOCK'
        }],
    }
};

const updateTenantWithRecaptchaConfig = () => {
    getAuth().tenantManager().updateTenant("tenant1-vzoc5", updateTenantRequest)
        .then((response) => {
            console.log('Updated reCAPTCHA config for tenant: ', response.recaptchaConfig.toJSON());
        }).catch((error) => {
            console.log('Error updating the tenant:', error);
        });
}

const getTenant = () => {
    getAuth(app).tenantManager().getTenant("tenant1-vzoc5").then((response) => {
        if (response.recaptchaConfig != undefined) {
            console.log('Tenant response: ', response.recaptchaConfig.toJSON());
        } else {
            console.log('Tenant does not have reCAPTCHA config enabled');
        }
    }).catch((error) => {
        console.log('Error fetching tenant:', error);
    });
}

// getProjectConfig();
// updateProjectConfigWithRecaptcha();
// getTenant();
updateTenantWithRecaptchaConfig();
// getTenant();


const http = require('http');
const { exit } = require('process');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World');
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
const core = require('@actions/core')
const { ClientSecretCredential } = require("@azure/identity");
const { SecretClient } = require("@azure/keyvault-secrets");



async function main() {
    try {
        // Global variables
        let Client_Id = core.getInput('Client_Id');
        let Secret_Id = core.getInput('Secret_Id');
        let Tenant_Id = core.getInput('Tenant_Id');
        let secrets = core.getInput('SecretNames');
        let VaultUrl = core.getInput('VaultUrl');
        
        let secretsArray = secrets.split(",");

        for(let i=0; i < secretsArray.length; i ++){

         let value =  getSecretFromAzureKeyVault(Tenant_Id, Client_Id, Secret_Id, VaultUrl, secretsArray[i]);
         console.log("exporting:"+secretsArray[i]+", "+ value);
         core.setOutput(secretsArray[i], value);
         core.exportVariable(secretsArray[i], value);
        }
      

    } catch (error) {
       console.log("Failed to fetch Azure KeyVault Secrets!");
        core.setFailed(error.message);
    }
}

async function getSecretFromAzureKeyVault(Tenant_Id, Client_Id, Secret_Id, VaultUrl, secretName) {
    try {
        console.log("Fetching:"+secretName);
        const credential = new ClientSecretCredential(Tenant_Id, Client_Id, Secret_Id);
        const client = new SecretClient(VaultUrl, credential);
        const latestSecret = await client.getSecret(secretName);
        return latestSecret.value;
    }
    catch (err) {
        console.log("Error in getSecretFromAzureKeyVault:" + err.message);
        throw new Error(`Error in getSecretFromAzureKeyVault${err.message}`);
    }
}


main();

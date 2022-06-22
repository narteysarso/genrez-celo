/**
 * get profile nft metadata for address
 * @param {object} contract smartcontract
 * @param {string} address wallet address
 * @returns {string}
 */
export const getProfileURI = async (contract, address) => {

    const profileURI = await contract.methods.profileURI(address).call();

    return profileURI;
}


/**
 * update profile nft with new uri for address
 * @param {object} contract smartcontract instance
 * @param {string} address wallet address
 * @param {string} uri metadata uri
 */
export const updateProfileURI = async (contract, address, uri) => {

    await contract.methods.updateProfile(uri).send({from : address});
}

/**
 * permanently burn profile nft for address 
 * @param {object} contract smartcontract instance
 * @param {string} address wallet address
 */
export const burnProfile = async (contract, address) => {

    await contract.methods.burnProfile().send({from : address});
}

/**
 * mint new profile nft for address
 * @param {object} contract smartcontract instance
 * @param {string} address wallet address 
 * @param {string} uri metadata uri
 */
export const mintProfile = async (contract, address, uri) => {
    
    await contract.methods.mintProfile(uri).send({from : address});

}

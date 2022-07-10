const {ethers} = require("hardhat");
const {expect} = require("chai");

describe("MusicNFT", function(){
    let musicContract;
    let creatorSBTContract;
    let owner;
    let acc1

    this.beforeEach(async () => {
        const musicNFTContract = await ethers.getContractFactory("MusicNFT");
        const creatorContract = await ethers.getContractFactory("CreatorSBT");

        creatorSBTContract = await creatorContract.deploy();

        [owner, acc1] = await ethers.getSigners();

        musicContract = await musicNFTContract.deploy(creatorSBTContract.address);
        
        
    });

    it("should mint a music nft with zSBT held by account", async () => {
        expect(await musicContract.balanceOf(acc1.address)).to.equal(0);
        expect(await creatorSBTContract.balanceOf(acc1.address)).to.equal(0);

        const tokenURI = "123456example";
        await creatorSBTContract.connect(acc1).mintProfile(tokenURI, "artist");

        expect(await creatorSBTContract.balanceOf(acc1.address)).to.equal(1);

        const musicTokenUri = "123456example";
        await musicContract.connect(acc1).mintMusic(musicTokenUri, "title", "artist", "feature");

        expect(await musicContract.balanceOf(acc1.address)).to.equal(1);
    });

    it("should not mint a music nft without zSBT token held by account", async() => {
        expect(await musicContract.balanceOf(acc1.address)).to.equal(0);
        expect(await creatorSBTContract.balanceOf(acc1.address)).to.equal(0);

        const musicTokenUri = "123456example";
        
        await expect( musicContract.connect(acc1).mintMusic(musicTokenUri, "title", "artist", "feature")).to.revertedWith("You need to mint zSBT");
    })
})
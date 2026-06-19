// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ReputationManager {
    address public owner;

    struct ValidatorStats {
        uint256 observedBlocks;
        uint256 onlineBlocks;

        uint256 participatedRounds;
        uint256 successfulVotes;
        uint256 unsuccessfulVotes;

        uint256 selectedRounds;
        uint256 consecutiveParticipation;
        uint256 lastParticipatedBlock;

        bool active;
    }

    mapping(address => ValidatorStats) private stats;
    address[] private validators;
    mapping(address => bool) private exists;

    event ValidatorRegistered(address indexed validator);
    event ValidatorDeactivated(address indexed validator);

    event BlockObserved(address indexed validator, uint256 blockNumber);
    event OnlineRecorded(address indexed validator, uint256 blockNumber);
    event SelectionRecorded(address indexed validator, uint256 blockNumber);
    event SuccessfulVoteRecorded(address indexed validator, uint256 blockNumber);
    event UnsuccessfulVoteRecorded(address indexed validator, uint256 blockNumber);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier onlyActiveValidator(address validator) {
        require(stats[validator].active, "Validator not active");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function registerValidator(address validator) external onlyOwner {
        require(validator != address(0), "Invalid validator");

        if (!exists[validator]) {
            validators.push(validator);
            exists[validator] = true;
        }

        stats[validator].active = true;

        emit ValidatorRegistered(validator);
    }

    function deactivateValidator(address validator)
        external
        onlyOwner
        onlyActiveValidator(validator)
    {
        stats[validator].active = false;
        emit ValidatorDeactivated(validator);
    }

    /*
        Call this after each finalized block.

        Meaning:
        - every active validator gets observedBlocks++
        - online/responsive validators get onlineBlocks++
        - selected committee validators get participatedRounds++
        - successful voters get successfulVotes++
        - unsuccessful voters get unsuccessfulVotes++
        - selected validators update consecutiveParticipation
    */
    function recordFinalizedBlock(
        uint256 blockNumber,
        address[] calldata onlineValidators,
        address[] calldata selectedValidators,
        address[] calldata successfulVoters,
        address[] calldata unsuccessfulVoters
    ) external onlyOwner {
        // 1. Every active validator was observed for this finalized block
        for (uint256 i = 0; i < validators.length; i++) {
            address validator = validators[i];

            if (stats[validator].active) {
                stats[validator].observedBlocks += 1;
                emit BlockObserved(validator, blockNumber);
            }
        }

        // 2. Validators that were online/responsive
        for (uint256 i = 0; i < onlineValidators.length; i++) {
            address validator = onlineValidators[i];
            require(stats[validator].active, "Online validator not active");

            stats[validator].onlineBlocks += 1;

            emit OnlineRecorded(validator, blockNumber);
        }

        // 3. Validators selected in committee
        for (uint256 i = 0; i < selectedValidators.length; i++) {
            address validator = selectedValidators[i];
            require(stats[validator].active, "Selected validator not active");

            stats[validator].selectedRounds += 1;
            stats[validator].participatedRounds += 1;

            if (stats[validator].lastParticipatedBlock + 1 == blockNumber) {
                stats[validator].consecutiveParticipation += 1;
            } else {
                stats[validator].consecutiveParticipation = 1;
            }

            stats[validator].lastParticipatedBlock = blockNumber;

            emit SelectionRecorded(validator, blockNumber);
        }

        // 4. Successful votes
        for (uint256 i = 0; i < successfulVoters.length; i++) {
            address validator = successfulVoters[i];
            require(stats[validator].active, "Successful voter not active");

            stats[validator].successfulVotes += 1;

            emit SuccessfulVoteRecorded(validator, blockNumber);
        }

        // 5. Unsuccessful votes
        for (uint256 i = 0; i < unsuccessfulVoters.length; i++) {
            address validator = unsuccessfulVoters[i];
            require(stats[validator].active, "Unsuccessful voter not active");

            stats[validator].unsuccessfulVotes += 1;

            emit UnsuccessfulVoteRecorded(validator, blockNumber);
        }
    }

    function getValidatorStats(address validator)
        external
        view
        returns (
            uint256 observedBlocks,
            uint256 onlineBlocks,
            uint256 participatedRounds,
            uint256 successfulVotes,
            uint256 unsuccessfulVotes,
            uint256 selectedRounds,
            uint256 consecutiveParticipation,
            uint256 lastParticipatedBlock,
            bool active
        )
    {
        ValidatorStats memory v = stats[validator];

        return (
            v.observedBlocks,
            v.onlineBlocks,
            v.participatedRounds,
            v.successfulVotes,
            v.unsuccessfulVotes,
            v.selectedRounds,
            v.consecutiveParticipation,
            v.lastParticipatedBlock,
            v.active
        );
    }

  

   

    function getActiveValidators() external view returns (address[] memory) {
        uint256 activeCount = 0;

        for (uint256 i = 0; i < validators.length; i++) {
            if (stats[validators[i]].active) {
                activeCount++;
            }
        }

        address[] memory activeValidators = new address[](activeCount);
        uint256 index = 0;

        for (uint256 i = 0; i < validators.length; i++) {
            if (stats[validators[i]].active) {
                activeValidators[index] = validators[i];
                index++;
            }
        }

        return activeValidators;
    }
}
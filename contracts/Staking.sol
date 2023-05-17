// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract ERC20Stakeable is ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public immutable rewardsToken;

    struct Staker {
        uint256 deposited;
        uint256 timeOfLastUpdate;
        uint256 unclaimedRewards;
        uint256 startStaking;
    }

    address private creator;
    address private burnable;

    // Rewards per hour. A fraction calculated as x/10.000.000 to get the percentage
    uint256 public rewardsPerHour; // 0.0416%/h or 1%/day
    uint256 public minStake = 1 * 10 ** 18;
    uint256 private maxRewardDay;
    uint256 private dayTime;
    uint256 public totalStaked;

    mapping(address => Staker) internal stakers;

    event Stake(address staker, uint256 _amount);

    event Withdraw(address staker, uint256 _deposit);

    constructor(address _token, address _burnable) {
        rewardsToken = IERC20(_token);
        rewardsPerHour = 4160;
        maxRewardDay = 13088133333 * 10 ** 18;
        dayTime = block.timestamp;
        creator = msg.sender;
        burnable = _burnable;
    }

    modifier onlyOwner() {
        require(msg.sender == creator, "Not an Owner");
        _;
    }

    function changeMaxRewardDay(uint256 _newreward) external onlyOwner {
        maxRewardDay = _newreward;
    }

    function changeRewardPerHour(uint256 _newreward) external onlyOwner {
        rewardsPerHour = _newreward;
    }

    function rewardPerDay() internal {}

    function deposit(uint256 _amount) external nonReentrant {
        require(_amount >= minStake, "Amount smaller than minimimum deposit");
        require(
            rewardsToken.balanceOf(msg.sender) >= _amount,
            "Can't stake more than you own"
        );

        // !необходимо выдать апрув данному контракту перед стейкингом
        rewardsToken.transferFrom(msg.sender, address(this), _amount);

        if (stakers[msg.sender].deposited == 0) {
            stakers[msg.sender].deposited = _amount;
            stakers[msg.sender].timeOfLastUpdate = block.timestamp;
            stakers[msg.sender].unclaimedRewards = 0;
            stakers[msg.sender].startStaking = block.timestamp;
            totalStaked += _amount;
        } else {
            uint256 rewards = calculateRewards(msg.sender);
            stakers[msg.sender].unclaimedRewards += rewards;
            stakers[msg.sender].deposited += _amount;
            stakers[msg.sender].timeOfLastUpdate = block.timestamp;
            totalStaked += _amount;
            // stakers[msg.sender].startStaking = block.timestamp;
        }

        emit Stake(msg.sender, _amount);
    }

    // Mints rewards for msg.sender
    function claimRewards() external nonReentrant {
        uint256 rewards = calculateRewards(msg.sender) +
            stakers[msg.sender].unclaimedRewards;
        require(rewards > 0, "You have no rewards");
        stakers[msg.sender].unclaimedRewards = 0;
        stakers[msg.sender].timeOfLastUpdate = block.timestamp;

        uint256 comission = (2 * rewards) / 100;

        rewardsToken.transfer(burnable, comission);

        rewardsToken.transfer(msg.sender, rewards - comission);
    }

    function withdraw(uint256 _amount) external nonReentrant {
        require(
            stakers[msg.sender].deposited >= _amount,
            "You have not enough deposit"
        );
        uint256 rewards = calculateRewards(msg.sender) +
            stakers[msg.sender].unclaimedRewards;
        stakers[msg.sender].unclaimedRewards = 0;
        stakers[msg.sender].deposited -= _amount;
        stakers[msg.sender].timeOfLastUpdate = block.timestamp;

        uint256 amounwithdraw = _amount + rewards;

        uint256 comission;

        if (stakers[msg.sender].startStaking + 30 days >= block.timestamp) {
            comission = (10 * rewards) / 100;
            rewardsToken.transfer(burnable, comission);
        } else {
            comission = 0;
        }

        rewardsToken.transfer(msg.sender, amounwithdraw - comission);

        totalStaked -= amounwithdraw;

        emit Withdraw(msg.sender, amounwithdraw);
    }

    // Withdraw specified amount of staked tokens
    function withdrawAll() external nonReentrant {
        require(stakers[msg.sender].deposited > 0, "You have no deposit");
        uint256 rewards = calculateRewards(msg.sender) +
            stakers[msg.sender].unclaimedRewards;
        uint256 _deposit = stakers[msg.sender].deposited;
        stakers[msg.sender].unclaimedRewards = 0;
        stakers[msg.sender].deposited = 0;
        stakers[msg.sender].timeOfLastUpdate = 0;

        uint256 amounwithdraw = _deposit + rewards;

        uint256 comission;

        if (stakers[msg.sender].startStaking + 30 days >= block.timestamp) {
            comission = (10 * rewards) / 100;
            rewardsToken.transfer(burnable, comission);
        } else {
            comission = 0;
        }

        rewardsToken.transfer(msg.sender, amounwithdraw - comission);

        totalStaked -= amounwithdraw;

        emit Withdraw(msg.sender, amounwithdraw);
    }

    // Function useful for fron-end that returns user stake and rewards by address
    function getDepositInfo(
        address _user
    ) public returns (uint256 _stake, uint256 _rewards, uint256 _startStaking) {
        _stake = stakers[_user].deposited;
        _rewards = calculateRewards(_user) + stakers[_user].unclaimedRewards;
        _startStaking = stakers[_user].startStaking;
        return (_stake, _rewards, _startStaking);
    }

    function calculateRewards(address _staker) internal returns (uint256) {
        uint256 rewardPerHours;
        if (stakers[_staker].deposited <= 10000 * 10 ** 18) {
            rewardPerHours = rewardsPerHour;
        } else if (
            stakers[_staker].deposited > 10000 &&
            stakers[_staker].deposited <= 1000000 * 10 ** 18
        ) {
            rewardPerHours = 3500;
        } else if (
            stakers[_staker].deposited > 1000000 &&
            stakers[_staker].deposited <= 10000000 * 10 ** 18
        ) {
            rewardPerHours = 3000;
        } else if (
            stakers[_staker].deposited > 10000000 &&
            stakers[_staker].deposited <= 100000000 * 10 ** 18
        ) {
            rewardPerHours = 2500;
        } else if (
            stakers[_staker].deposited > 100000000 &&
            stakers[_staker].deposited <= 1000000000 * 10 ** 18
        ) {
            rewardPerHours = 2000;
        } else if (
            stakers[_staker].deposited > 1000000000 &&
            stakers[_staker].deposited <= 10000000000 * 10 ** 18
        ) {
            rewardPerHours = 1500;
        } else if (
            stakers[_staker].deposited > 10000000000 &&
            stakers[_staker].deposited <= 100000000000 * 10 ** 18
        ) {
            rewardPerHours = 1000;
        }

        uint256 allrewards = ((((block.timestamp -
            stakers[_staker].timeOfLastUpdate) * stakers[_staker].deposited) *
            rewardPerHours) / 3600) / 10000000;

        if (maxRewardDay >= allrewards) {
            maxRewardDay -= allrewards;
            return allrewards;
        } else {
            uint256 returnReward = maxRewardDay;
            maxRewardDay = 0;
            return returnReward;
        }
    }

    function WithdrawFromContract(address to) external onlyOwner {
        uint256 balance = rewardsToken.balanceOf(address(this));
        rewardsToken.transfer(to, balance);
    }

    //!реализовать скрипт, который каждый день будет обновлять пул наград
    function changeDay() external onlyOwner {
        require(dayTime >= 1 days, "Day is not end");
        dayTime = block.timestamp;
        maxRewardDay = 13088133333 * 10 ** 18;
    }
}

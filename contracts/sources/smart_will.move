/*
/// Module: smart_will
module smart_will::smart_will;
*/

// For Move coding conventions, see
// https://docs.sui.io/concepts/sui-move-concepts/conventions

module smart_will::will_contract {
    use sui::object::{UID, new, ID};
    use sui::tx_context::TxContext;
    use sui::transfer;
    use sui::event;
    use sui::coin::{Self, Coin};
    use sui::sui::SUI; 
    use std::vector;

    /// ==== 遺囑結構 ====
    public struct SmartWill has key, store {
        id: UID,
        owner: address,
        custodian: address,
        recipients: vector<address>,
        proportions: vector<u64>,
        last_checkin: u64,
        interval_months: u64
    }

    /// ==== 事件定義 ====
    public struct RenewedEvent has copy, drop {
        will_id: ID,
        renew_time: u64
    }

    public struct DistributionEvent has copy, drop {
        will_id: ID,
        distributed_amount: u64
    }

    /// 每月的毫秒數 (30天)
    const MONTH_IN_MS: u64 = 2592000000;

    /// **創建遺囑**
    public entry fun create_will(
        owner: address,
        custodian: address,
        recipients: vector<address>,
        proportions: vector<u64>,
        interval_months: u64,
        ctx: &mut TxContext
    ) {
        let total = validate_proportions(&proportions);
        assert!(total == 100, 1001);

        let will = SmartWill {
            id: new(ctx),
            owner,
            custodian,
            recipients,
            proportions,
            last_checkin: ctx.epoch(), 
            interval_months
        };

        transfer::public_transfer(will, owner);
    }

    /// **持有人更新存活狀態**
    public entry fun renew_life(will: &mut SmartWill, ctx: &mut TxContext) {
        assert!(ctx.sender() == will.owner, 1002);

        will.last_checkin = ctx.epoch();

        let will_id = object::id(will);
        event::emit(RenewedEvent {
            will_id: will_id,
            renew_time: will.last_checkin
        });
    }

    /// **執行資產分配**
    public entry fun execute_distribution(
        will: SmartWill,
        ctx: &mut TxContext
    ) {
        assert!(ctx.sender() == will.custodian, 1003);

        let current_time = ctx.epoch();
        let elapsed_time = current_time - will.last_checkin;
        let max_interval = will.interval_months * MONTH_IN_MS;
        assert!(elapsed_time > max_interval, 1004);

        let mut owner_coins: Coin<SUI> = coin::zero(ctx);
        let balance: u64 = coin::value(&owner_coins);

        let mut i = 0;
        while (i < vector::length(&will.recipients)) {
            let recipient = *vector::borrow(&will.recipients, i);
            let proportion = *vector::borrow(&will.proportions, i);
            let amount = balance * proportion / 100;

            let split_coin: Coin<SUI> = coin::split(&mut owner_coins, amount, ctx);
            transfer::public_transfer(split_coin, recipient);

            i = i + 1;
        };

        transfer::public_transfer(owner_coins, will.custodian);

        let will_id = object::id(&will);
        event::emit(DistributionEvent {
            will_id: will_id,
            distributed_amount: balance
        });

        transfer::public_share_object(will);
    }

    fun validate_proportions(proportions: &vector<u64>): u64 {
        let mut total: u64 = 0;
        let mut i = 0;
        while (i < vector::length(proportions)) {
            total = total + *vector::borrow(proportions, i);
            i = i + 1;
        };
        total
    }
}


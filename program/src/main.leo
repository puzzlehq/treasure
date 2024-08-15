program treasure_hunt_v001.aleo {
    const AUDITOR: address = aleo142y6qzj0448tynuwhrwchp78uj94exuy0zfqgcaakw2y60g53u9q5qj5sd;

    // Never owned by multisig
    record Piece {
        owner: address,
        amount: u64,
    }

    record AuditMint {
        owner: address,
        minter: address,
        amount: u64,
    }

    record AuditJoin {
        owner: address,
        joiner: address,
        amount: u64,
    }

    // owned by multisig
    record PieceStake {
        owner: address,
        amount: u64,
        challenger: address,
        opponent: address,
        staker: address,
    }

    // owned by multisig
    record PieceClaim {
        owner: address,
        amount: u64,
        claimer: address,
        message_1: field,
        message_2: field,
        message_3: field,
        message_4: field,
        message_5: field,
        challenger: address,
        opponent: address,
    }

    // owned by individual
    record ClaimSignature {
        owner: address,
        sig: signature,
        amount: u64,
        game_multisig: address,
        challenger: address,
        opponent: address,
    }

    // owned by multsig
    record JointPieceTimeClaim {
        owner: address,
        amount: u64,
        time_claimer_address: address,
        state_updater_address: address,
        message_1: field,
        message_2: field,
        message_3: field,
        message_4: field,
        message_5: field,
        game_multisig: address,
        challenger: address,
        opponent: address,
        block_ht: u32,
    }

    // owned by multisig
    record PieceJointStake {
        owner: address,
        amount: u64,
        time_claimer_address: address,
        state_updater_address: address,
        block_ht: u32,
    }
    //For block height — user can set it but can’t pull it onchain to check until a finalize
    // So a multisig Alice may want to penalize Bob and take bob’s stake if he inputs the wrong on
    // - We should track who updates this multisig state to who sets block height to be able to penalize
    // something like adding input (address, sig) where address is individual key with signature set to something
    // and set JointPieceCreator: address (challenger or opponent) ---> question about what is field vulnerabilities for msg

    // owned by challenger only
    record JointPieceState {
        owner: address,
        amount: u64,
        time_claimer_address: address,
        state_updater_address: address,
        message_1: field,
        message_2: field,
        message_3: field,
        message_4: field,
        message_5: field,
        challenger: address,
        opponent: address,
        game_multisig: address,
    }

    // owned by multisig
    record JointPieceWinner {
        owner: address,
        amount: u64,
        time_claimer_address: address,
        state_updater_address: address,
        challenger: address,
        opponent: address,
        game_multisig: address,
        winner: address,
    }

    record Game {
        owner: address,
        challenger_commit: field,
        opponent_answer: field,
        total_pot: u64,
        challenger_address: address,
        opponent_address: address,
        game_multisig: address,
        game_state: field,
    }

    // GAME STATE RECORDED ON NOTIFICATIONS
    // private game_state: field,
        // NORMAL FLOW
        // 1 -> challenger proposed game
        // 2 -> opponent matched wager
        // 3 -> accepted game
        // 4 -> challenger revealed answer
        // 5 -> finished game
        //
        // ALTERNATE EXIT PATHS
        // 6 -> timeout finished game
        // 0 -> Game reneged

    // your turn:
        // true -> your turn or ms turn
        // false -> awaiting other party turn

     // sent to opponent on propose game for FE/client detection.
    // consumed in match wager
    record GameReqNotification {
        owner: address, //opponent
        game_multisig: address,
        game_state: field,
        your_turn: bool,
        total_pot: u64,
        challenger_address: address,
        opponent_address: address,
    }

    // sent to challenger on propose game for FE/client detection.
    // consumed in reveal answer
    record WaitingAcceptanceNotification {
        owner: address, //opponent
        game_multisig: address,
        game_state: field,
        your_turn: bool,
        total_pot: u64,
        challenger_address: address,
        opponent_address: address,
    }

    record StakeRenegedNotification {
        owner: address, //opponent
        game_multisig: address,
        game_state: field,
        your_turn: bool,
        total_pot: u64,
        challenger_address: address,
        opponent_address: address,
        renege_address: address,
    }

    // sent to challenger on submit wager for FE/client detection.
    // consumed in reveal answer
    record ChallengerWagerNotification {
        owner: address, //opponent
        game_multisig: address,
        game_state: field,
        your_turn: bool,
        total_pot: u64,
        challenger_address: address,
        opponent_address: address,
    }

    record OpponentWagerNotification {
        owner: address, //opponent
        game_multisig: address,
        game_state: field,
        your_turn: bool,
        total_pot: u64,
        challenger_address: address,
        opponent_address: address,
    }

    // sent to opponent on accept game for FE/client detection.
    // consumed in finish_game/claim total pot
    record WaitingRevealNotification {
        owner: address, //opponent
        game_multisig: address,
        game_state: field,
        your_turn: bool,
        total_pot: u64,
        challenger_address: address,
        opponent_address: address,
    }

    // sent to challenger on accept game for FE/client detection.
    // consumed in reveal answer
    record RevealAnswerNotification {
        owner: address, //opponent
        game_multisig: address,
        game_state: field,
        your_turn: bool,
        total_pot: u64,
        challenger_address: address,
        opponent_address: address,
        opponent_answer: field,
    }

    // sent to opponent on reveal answer for FE/client detection.
    record GameFinishReqNotification {
        owner: address, //opponent
        game_multisig: address,
        game_state: field,
        your_turn: bool,
        total_pot: u64,
        challenger_address: address,
        opponent_address: address,
        challenger_answer: field,
        opponent_answer: field,
        winner: address,
        loser: address,
    }

    // sent to both opponent and challenger on finish game
    record GameFinishedNotification {
        owner: address,
        game_multisig: address,
        game_state: field,
        your_turn: bool,
        total_pot: u64,
        challenger_address: address,
        opponent_address: address,
        winner: address,
        loser: address,
    }

    /// PVP Structs/Records
    struct Message {
        field_1: field,
        field_2: field,
        field_3: field,
        field_4: field,
        field_5: field,
    }

    record Answer {
        owner: address, //challenger
        challenger_address: address,
        opponent_address: address,
        game_multisig: address,
        amount: u64,
        nonce: field,
        answer: field,
        message_1: field,
        message_2: field,
        message_3: field,
        message_4: field,
        message_5: field,
    }

    record RevealAnswer {
        owner: address, //challenger
        challenger_address: address,
        opponent_address: address,
        game_multisig: address,
        amount: u64,
        nonce: field,
        answer: field,
        sig: signature,
    }

    record Key {
        owner: address, //opponent
        seed: field,
        amount: u64,
        challenger: address,
        opponent: address,
        game_multisig: address,
    }

    transition mint_pieces
    (
        amount: u64,
        to: address,
    ) ->
    (
        Piece,
        AuditMint,
    )
    {
        // no checks on minting right now. test actions and audit without address check

        // puzzle pieces minted
        let minted_puzzle_pieces: Piece = Piece {
            owner: to,
            amount: amount
        };

        // audit record for issuer to know supply
        let audit_record: AuditMint = AuditMint {
            owner: AUDITOR,
            minter: to,
            amount: amount
        };

        return (minted_puzzle_pieces, audit_record);

    }

    // join 2 pieces
    transition join_pieces
    (
        piece_record_one: Piece,
        piece_record_two: Piece,
    ) ->
    (
        Piece,
        AuditJoin,
    )
    {
        // assert contracts can't call this
        assert_eq(self.caller, self.signer);

        // assert that function caller owns both piece records
        assert(piece_record_one.owner == self.signer);
        assert(piece_record_two.owner == self.signer);

        // assert that the piece records have values > 0
        assert(piece_record_one.amount > 0u64);
        assert(piece_record_two.amount > 0u64);

        let joined_piece_record: Piece = Piece {
            owner: self.signer,
            amount: piece_record_one.amount + piece_record_two.amount
        };

        // audit record for issuer to know supply
        let audit_join_record: AuditJoin = AuditJoin {
            owner: AUDITOR,
            joiner: self.signer,
            amount: piece_record_one.amount + piece_record_two.amount
        };

        return (joined_piece_record, audit_join_record);
    }

    // todo: add below back as outputs
    // AuditStakeIn,
    // AuditMintAnswer,
    // AuditKey,
    transition propose_game
    (
        //puzzle_pieces.stake_transfer_in() data
        wager_record: Piece,
        challenger_wager_amount: u64,
        sender: address, // Challenger address proposing game
        challenger: address,
        opponent: address,
        game_multisig: address,
        challenger_message_1: field, //from output of useSignature
        challenger_message_2: field,
        challenger_message_3: field,
        challenger_message_4: field,
        challenger_message_5: field,
        challenger_sig: signature, //from output of useSignature
        //multiparty_pvp_utils data
        challenger_nonce: field,
        challenger_answer: field,
        game_multisig_seed: field, //game_multisig seed to send to user
        //wheres_alex data
    ) ->
    (
        PieceClaim,
        PieceStake,
        ClaimSignature,
        Piece,
        Answer,
        Key,
        Game,
        GameReqNotification,
        WaitingAcceptanceNotification
    )
    {
         // assert contracts can't call this
        assert_eq(self.caller, self.signer);

        // random edge case, maybe unnecessary
        // assert_neq(game_multisig, opponent);

        // check that challenger & opponent are different addresses
        // assert_neq( challenger , opponent);

        // assert that player 1s answer is either "in weeds" or "behind building"
        assert(challenger_answer == 0field || challenger_answer == 1field);
        // hash the answer and nonce
        let challenger_commit: field = BHP256::commit_to_field(challenger_answer, challenger_nonce as scalar);

        // assert that the wager amount > 0 and wager inside credit == wager amt passed
        assert(challenger_wager_amount > 0u64);
        // assert that the wager record has >= amount wagered
        assert(wager_record.amount >= challenger_wager_amount);

         // ownership checks on sender == self.signer cant be done until Leo is updated
        assert_eq(wager_record.owner, self.signer);

        // stake in logic

        let piece_claim_challenger: PieceClaim = PieceClaim {
            owner: game_multisig,
            amount: challenger_wager_amount,
            claimer: sender,
            message_1: challenger_message_1,
            message_2: challenger_message_2,
            message_3: challenger_message_3,
            message_4: challenger_message_4,
            message_5: challenger_message_5,
            challenger: challenger,
            opponent: opponent
        };

        // claim signature to depositor -- signature against message and used to redeem
        let claim_signature_challenger: ClaimSignature = ClaimSignature {
            owner: sender,
            sig: challenger_sig,
            amount: challenger_wager_amount,
            game_multisig: game_multisig,
            challenger: challenger,
            opponent: opponent
        };

        // new puzz record to receiver
        let piece_stake_challenger: PieceStake = PieceStake {
            owner: game_multisig,
            amount: challenger_wager_amount,
            challenger: challenger,
            opponent: opponent,
            staker: challenger
        };

        // puzz record with change for sender
        let piece_change_challenger: Piece = Piece {
            owner: sender,
            amount: wager_record.amount - challenger_wager_amount
        };

        // record to asset issuer to keep tabs on activity
        // let audit_stake_in_record: AuditStakeIn = AuditStakeIn {
        //     owner: puzzle_issuer,
        //     staker: wager_record.owner,
        //     amount_in: challenger_wager_amount,
        //     challenger: challenger,
        //     opponent: opponent,
        //     game_multisig: game_multisig
        // };

        // key record logic
        // not doing because need to turn SK_SIG_DOMAIN in keygen into
        // fields. Can do easier after string support

        let key_record: Key = Key {
            owner: opponent,
            seed: game_multisig_seed,
            amount: challenger_wager_amount,
            challenger: challenger,
            opponent: opponent,
            game_multisig: game_multisig
        };

        // let audit_key_record: AuditKey = AuditKey {
        //     owner: puzzle_issuer,
        //     seed: game_multisig_seed,
        //     amount: challenger_wager_amount,
        //     challenger: challenger,
        //     opponent: opponent,
        //     game_multisig: game_multisig
        // };

        let msg: Message = Message {
            field_1: challenger_message_1,
            field_2: challenger_message_2,
            field_3: challenger_message_3,
            field_4: challenger_message_4,
            field_5: challenger_message_5
        };

        // Verify signature against message to guarantee challenger is caller
        let signature_check: bool = true;
        let is_valid_sig: bool = challenger_sig.verify(challenger, msg);
        assert_eq(signature_check,is_valid_sig);


        // mint answer logic
        let challenger_answer_record: Answer = Answer {
            owner: challenger,
            challenger_address: challenger,
            opponent_address: opponent,
            game_multisig: game_multisig,
            amount: challenger_wager_amount,
            nonce: challenger_nonce,
            answer: challenger_answer,
            message_1: challenger_message_1,
            message_2: challenger_message_2,
            message_3: challenger_message_3,
            message_4: challenger_message_4,
            message_5: challenger_message_5
        };

        // let audit_mint_answer_record: AuditMintAnswer = AuditMintAnswer {
        //     owner: puzzle_issuer,
        //     answer_owner: challenger,
        //     challenger_address: challenger,
        //     opponent_address: opponent,
        //     game_multisig: game_multisig,
        //     amount: challenger_wager_amount,
        //     nonce: challenger_nonce,
        //     answer: challenger_answer,
        //     message_1: challenger_message_1,
        //     message_2: challenger_message_2,
        //     message_3: challenger_message_3,
        //     message_4: challenger_message_4,
        //     message_5: challenger_message_5
        // };

        // notify record logic
        let game_request_notification_record: GameReqNotification = GameReqNotification {
            owner: opponent, //opponent
            game_multisig: game_multisig,
            game_state: 1field,
            your_turn: true,
            total_pot: challenger_wager_amount + challenger_wager_amount,
            challenger_address: challenger,
            opponent_address: opponent
        };

        let game_waiting_acceptance_notification_record: WaitingAcceptanceNotification = WaitingAcceptanceNotification {
            owner: challenger, //challenger
            game_multisig: game_multisig,
            game_state: 1field,
            your_turn: false,
            total_pot: challenger_wager_amount + challenger_wager_amount,
            challenger_address: challenger,
            opponent_address: opponent
        };

        let game_record: Game = Game {
            owner: game_multisig,
            challenger_commit: challenger_commit,
            opponent_answer: 123field, // random field for now until opponent answer in accept_game
            total_pot: challenger_wager_amount + challenger_wager_amount,
            challenger_address: challenger,
            opponent_address: opponent,
            game_multisig: game_multisig,
            game_state: 1field
        };


        // todo: fix naming convention later
        return (
            piece_claim_challenger,
            piece_stake_challenger,
            claim_signature_challenger,
            piece_change_challenger,
            // audit_stake_in_record,
            challenger_answer_record,
            // audit_mint_answer_record,
            key_record,
            // audit_key_record,
            game_record,
            game_request_notification_record,
            game_waiting_acceptance_notification_record,
        );
    }

    // todo: add below back as outputs
    //AuditStakeOut,
    // challenger calls this function with Multisig key and signature as input
    // that was submitted when proposing game and that exists on claim record
    transition challenger_renege_stake
    (
        waiting_accept_game_notification: WaitingAcceptanceNotification,
        piece_stake_challenger: PieceStake,
        piece_claim_challenger: PieceClaim,
        challenger_sig: signature,
    ) -> (
        Piece,
        StakeRenegedNotification,
        StakeRenegedNotification,
        )
    {
        // assert contracts can't call this
        assert_eq(self.caller, self.signer);

        // stake transfer out logic

        // 1. Check Claim & Stake are from same game_multisig
        assert_eq(piece_stake_challenger.owner, piece_claim_challenger.owner);

        // 2. Check Claim & Stake have the same game details
        assert_eq(piece_stake_challenger.challenger, piece_claim_challenger.challenger);
        assert_eq(piece_stake_challenger.opponent, piece_claim_challenger.opponent);
        assert_eq(piece_stake_challenger.amount, piece_claim_challenger.amount);

        // 3. Check Claimer has verified this with a fresh signature against the message
        let msg: Message = Message {
            field_1: piece_claim_challenger.message_1,
            field_2: piece_claim_challenger.message_2,
            field_3: piece_claim_challenger.message_3,
            field_4: piece_claim_challenger.message_4,
            field_5: piece_claim_challenger.message_5
        };

        // check against same signature and message submitted from propose_game
        let signature_check: bool = true;
        let is_valid_sig: bool = challenger_sig.verify(piece_claim_challenger.claimer, msg);
        assert_eq(signature_check, is_valid_sig);

        let piece_record: Piece = Piece {
            owner: piece_claim_challenger.claimer,
            amount: piece_claim_challenger.amount
        };

        // let audit_stake_out_record: AuditStakeOut = AuditStakeOut {
        //     owner: puzzle_issuer,
        //     staker: piece_claim_challenger.claimer,
        //     amount_in: piece_claim_challenger.amount,
        //     challenger: piece_claim_challenger.challenger,
        //     opponent: piece_claim_challenger.opponent,
        //     game_multisig: piece_claim_challenger.owner
        // };

        let notify_challenger_stake_reneged: StakeRenegedNotification = StakeRenegedNotification {
            owner: waiting_accept_game_notification.challenger_address, //opponent
            game_multisig: waiting_accept_game_notification.game_multisig,
            game_state: 0field,
            your_turn: false,
            total_pot: waiting_accept_game_notification.total_pot,
            challenger_address: waiting_accept_game_notification.challenger_address,
            opponent_address: waiting_accept_game_notification.opponent_address,
            renege_address: waiting_accept_game_notification.challenger_address
        };


        let notify_opponent_stake_reneged: StakeRenegedNotification = StakeRenegedNotification {
            owner: waiting_accept_game_notification.opponent_address, //opponent
            game_multisig: waiting_accept_game_notification.game_multisig,
            game_state: 0field,
            your_turn: false,
            total_pot: waiting_accept_game_notification.total_pot,
            challenger_address: waiting_accept_game_notification.challenger_address,
            opponent_address: waiting_accept_game_notification.opponent_address,
            renege_address: waiting_accept_game_notification.challenger_address
        };

        return (
            piece_record,
            // audit_stake_out_record,
            notify_challenger_stake_reneged,
            notify_opponent_stake_reneged
        );

    }

    // todo: add below back as outputs
    //AuditStakeIn,
    transition submit_wager (
        opponent_wager_record: Piece,
        key_record: Key,
        game_req_notification: GameReqNotification,
        opponent_message_1: field, //from output of useSignature
        opponent_message_2: field,
        opponent_message_3: field,
        opponent_message_4: field,
        opponent_message_5: field,
        opponent_sig: signature, //from output of useSignature
    ) -> (
        PieceClaim,
        PieceStake,
        ClaimSignature,
        Piece,
        ChallengerWagerNotification,
        OpponentWagerNotification,
    )
    {
        // Logic Checks
        // limit calls to only users
        assert_eq(self.caller, self.signer);

        // assert that the wager amount > 0 and wager inside credit == wager amt passed
        assert(opponent_wager_record.amount > 0u64);
        // assert that the wager record has >= total pot / 2u64
        assert(opponent_wager_record.amount >= game_req_notification.total_pot / 2u64);

        // stake in logic

        let wager_amount: u64 = game_req_notification.total_pot / 2u64;

        let piece_claim_opponent: PieceClaim = PieceClaim {
            owner: game_req_notification.game_multisig,
            amount: wager_amount,
            claimer: self.signer,
            message_1: opponent_message_1,
            message_2: opponent_message_2,
            message_3: opponent_message_3,
            message_4: opponent_message_4,
            message_5: opponent_message_5,
            challenger: game_req_notification.challenger_address,
            opponent: game_req_notification.opponent_address
        };

        // claim signature to depositor -- signature against message and used to redeem
        let claim_signature_opponent: ClaimSignature = ClaimSignature {
            owner: self.signer,
            sig: opponent_sig,
            amount: wager_amount,
            game_multisig: game_req_notification.game_multisig,
            challenger: game_req_notification.challenger_address,
            opponent: game_req_notification.opponent_address
        };

        // new puzz record to receiver
        let piece_stake_opponent: PieceStake = PieceStake {
            owner: game_req_notification.game_multisig,
            amount: wager_amount,
            challenger: game_req_notification.challenger_address,
            opponent: game_req_notification.opponent_address,
            staker: game_req_notification.opponent_address
        };

        // puzz record with change for sender
        let piece_change_opponent: Piece = Piece {
            owner: self.signer,
            amount: opponent_wager_record.amount - wager_amount
        };

        // record to asset issuer to keep tabs on activity
        // let audit_stake_in_record: AuditStakeIn = AuditStakeIn {
        //     owner: puzzle_issuer,
        //     staker: opponent_wager_record.owner,
        //     amount_in: wager_amount,
        //     challenger: game_req_notification.challenger_address,
        //     opponent: game_req_notification.opponent_address,
        //     game_multisig: game_req_notification.game_multisig
        // };

        let challenger_submitted_wager_notification_record: ChallengerWagerNotification = ChallengerWagerNotification {
            owner: game_req_notification.challenger_address,
            game_multisig: game_req_notification.game_multisig,
            game_state: 2field,
            your_turn: false,
            total_pot: game_req_notification.total_pot,
            challenger_address: game_req_notification.challenger_address,
            opponent_address: game_req_notification.opponent_address
        };

        let opponent_submitted_wager_notification_record: OpponentWagerNotification = OpponentWagerNotification {
            owner: game_req_notification.opponent_address,
            game_multisig: game_req_notification.game_multisig,
            game_state: 2field,
            your_turn: true,
            total_pot: game_req_notification.total_pot,
            challenger_address: game_req_notification.challenger_address,
            opponent_address: game_req_notification.opponent_address
        };

        return (
            piece_claim_opponent,
            piece_stake_opponent,
            claim_signature_opponent,
            piece_change_opponent,
            // audit_stake_in_record,
            challenger_submitted_wager_notification_record,
            opponent_submitted_wager_notification_record,
        );

    }


    // todo: add below back as outputs
    //AuditStakeOut,
    // opponent calls this function with Multisig key and signature as input
    // that was submitted when submitting wager that exists on claim record
    transition opponent_renege_stake
    (
        waiting_accept_game_notification: WaitingAcceptanceNotification,
        piece_stake_opponent: PieceStake,
        piece_claim_opponent: PieceClaim,
        opponent_sig: signature,
    ) -> (
        Piece,
        StakeRenegedNotification,
        StakeRenegedNotification,
        )
    {
        // assert contracts can't call this
        assert_eq(self.caller, self.signer);

        // stake out logic

        // 1. Check Claim & Stake are from same game_multisig
        assert_eq(piece_stake_opponent.owner, piece_claim_opponent.owner);

        // 2. Check Claim & Stake have the same game details
        assert_eq(piece_stake_opponent.challenger, piece_claim_opponent.challenger);
        assert_eq(piece_stake_opponent.opponent, piece_claim_opponent.opponent);
        assert_eq(piece_stake_opponent.amount, piece_claim_opponent.amount);

        // 3. Check Claimer has verified this with a fresh signature against the message
        let msg: Message = Message {
            field_1: piece_claim_opponent.message_1,
            field_2: piece_claim_opponent.message_2,
            field_3: piece_claim_opponent.message_3,
            field_4: piece_claim_opponent.message_4,
            field_5: piece_claim_opponent.message_5
        };

        let signature_check: bool = true;
        let is_valid_sig: bool = opponent_sig.verify(piece_claim_opponent.claimer, msg);
        assert_eq(signature_check, is_valid_sig);

        let piece_record: Piece = Piece {
            owner: piece_claim_opponent.claimer,
            amount: piece_claim_opponent.amount
        };

        // let audit_stake_out_record: AuditStakeOut = AuditStakeOut {
        //     owner: puzzle_issuer,
        //     staker: piece_claim_opponent.claimer,
        //     amount_in: piece_claim_opponent.amount,
        //     challenger: piece_claim_opponent.challenger,
        //     opponent: piece_claim_opponent.opponent,
        //     game_multisig: piece_claim_opponent.owner
        // };

        let notify_challenger_stake_reneged: StakeRenegedNotification = StakeRenegedNotification {
            owner: waiting_accept_game_notification.challenger_address, //opponent
            game_multisig: waiting_accept_game_notification.game_multisig,
            game_state: 0field,
            your_turn: false,
            total_pot: waiting_accept_game_notification.total_pot,
            challenger_address: waiting_accept_game_notification.challenger_address,
            opponent_address: waiting_accept_game_notification.opponent_address,
            renege_address: waiting_accept_game_notification.opponent_address
        };

        let notify_opponent_stake_reneged: StakeRenegedNotification = StakeRenegedNotification {
            owner: waiting_accept_game_notification.opponent_address, //opponent
            game_multisig: waiting_accept_game_notification.game_multisig,
            game_state: 0field,
            your_turn: false,
            total_pot: waiting_accept_game_notification.total_pot,
            challenger_address: waiting_accept_game_notification.challenger_address,
            opponent_address: waiting_accept_game_notification.opponent_address,
            renege_address: waiting_accept_game_notification.opponent_address
        };

        return (
            piece_record,
            // audit_stake_out_record,
            notify_challenger_stake_reneged,
            notify_opponent_stake_reneged
        );

    }

    // todo: add below back as outputs
    // AuditJointStake,
    // called by ms key after wager is confirmed on network
    async transition accept_game
    (
        game_record: Game,
        opponent_answer: field,
        piece_stake_challenger: PieceStake,
        piece_claim_challenger: PieceClaim,
        piece_stake_opponent: PieceStake,
        piece_claim_opponent: PieceClaim,
        block_ht: u32
    ) -> (
        PieceJointStake,
        JointPieceTimeClaim,
        JointPieceState,
        WaitingRevealNotification,
        RevealAnswerNotification,
        Game,
        Future
    )
    {
         // assert that the game address/multiisg is calling this
        assert_eq(game_record.owner, self.signer);

        // assert contracts can't call this
        assert_eq(self.caller, self.signer);

        // assert that player 1s answer is either "in weeds" or "behind building"
        assert(opponent_answer == 0field || opponent_answer == 1field);

        let total_pot: u64 = game_record.total_pot;

        // 0. Add a self.signer check against
        let owner: address = piece_stake_challenger.owner;

        // 1. Check that all are from the same multisig
        assert_eq(piece_claim_challenger.owner, owner);
        assert_eq(piece_stake_opponent.owner, owner);
        assert_eq(piece_claim_opponent.owner, owner);

        // 2. Check that the game state is the same for all
        let amount: u64 = piece_stake_challenger.amount;
        assert_eq(piece_claim_challenger.amount, amount);
        assert_eq(piece_stake_opponent.amount, amount);
        assert_eq(piece_claim_opponent.amount, amount);

        let challenger: address = piece_stake_challenger.challenger;
        assert_eq(piece_claim_challenger.challenger, challenger);
        assert_eq(piece_stake_opponent.challenger, challenger);
        assert_eq(piece_claim_opponent.challenger, challenger);

        let opponent: address = piece_stake_challenger.opponent;
        assert_eq(piece_claim_challenger.opponent, opponent);
        assert_eq(piece_stake_opponent.opponent, opponent);
        assert_eq(piece_claim_opponent.opponent, opponent);

        // 3. Check that claimer addresses match stake address
        assert_eq(piece_claim_challenger.claimer, piece_stake_challenger.challenger);
        assert_eq(piece_claim_opponent.claimer, piece_stake_opponent.opponent);

        let piece_joint_stake: PieceJointStake = PieceJointStake {
            owner: owner,
            amount: total_pot,
            time_claimer_address: opponent,
            state_updater_address: challenger,
            block_ht: block_ht
        };


        let joint_piece_time_claim: JointPieceTimeClaim = JointPieceTimeClaim  {
            owner: owner,
            amount: total_pot,
            time_claimer_address: opponent,
            state_updater_address: challenger,
            message_1: piece_claim_opponent.message_1,
            message_2: piece_claim_opponent.message_2,
            message_3: piece_claim_opponent.message_3,
            message_4: piece_claim_opponent.message_4,
            message_5: piece_claim_opponent.message_5,
            game_multisig: owner,
            challenger: challenger,
            opponent: opponent,
            block_ht: block_ht
        };

        let joint_piece_state: JointPieceState = JointPieceState {
            owner: challenger,
            amount: total_pot,
            time_claimer_address: opponent,
            state_updater_address: challenger,
            message_1: piece_claim_challenger.message_1,
            message_2: piece_claim_challenger.message_2,
            message_3: piece_claim_challenger.message_3,
            message_4: piece_claim_challenger.message_4,
            message_5: piece_claim_challenger.message_5,
            challenger: challenger,
            opponent: opponent,
            game_multisig: owner
        };


        // let audit_joint_stake: AuditJointStake = AuditJointStake {
        //     owner: opponent,
        //     amount: total_pot,
        //     time_claimer_address: opponent,
        //     state_updater_address: challenger,
        //     block_ht: block_ht,
        //     challenger: challenger,
        //     opponent: opponent,
        //     game_multisig: owner
        // };

        // sent to opponent on accept_game
        let waiting_reveal_answer_notifcation_record: WaitingRevealNotification = WaitingRevealNotification {
            owner: game_record.opponent_address,
            game_multisig: game_record.owner,
            game_state: 3field,
            your_turn: false,
            total_pot: game_record.total_pot,
            challenger_address: game_record.challenger_address,
            opponent_address: game_record.opponent_address
        };

        // sent to challenger on accept_game
        let reveal_answer_notification_record: RevealAnswerNotification = RevealAnswerNotification {
            owner: game_record.challenger_address,
            game_multisig: game_record.owner,
            game_state: 3field,
            your_turn: true,
            total_pot: game_record.total_pot,
            challenger_address: game_record.challenger_address,
            opponent_address: game_record.opponent_address,
            opponent_answer: opponent_answer
        };

        let updated_game_record: Game = Game {
            owner: game_record.owner,
            challenger_commit: game_record.challenger_commit,
            opponent_answer: opponent_answer,
            total_pot: game_record.total_pot,
            challenger_address: game_record.challenger_address,
            opponent_address: game_record.opponent_address,
            game_multisig: game_record.game_multisig,
            game_state: 3field
        };

        return (
            piece_joint_stake,
            joint_piece_time_claim,
            joint_piece_state,
            // audit_joint_stake,
            waiting_reveal_answer_notifcation_record,
            reveal_answer_notification_record,
            updated_game_record,
            finalize_accept_game(block_ht)
        );
    }

    async function finalize_accept_game(block_ht: u32) {
        // block every 5 seconds or so
        // would need to wait for time between `accept_game` req. from client to being proved
        // ~ 5s per block
        // leeway of 100 blocks = 100 * 5 = 500 / 60 = ~8.33 mins.
        // assert that block_ht passed in is within 100 blocks of current block ht.
        //
        // Check legit block height as input
        let current_block_ht: u32 = block.height;
        assert(block_ht >= current_block_ht - 1000u32);
        assert(block_ht <= current_block_ht + 1000u32);
    }

    // todo: add below back as outputs
    // AuditRevealAnswer,
    // AuditJointPieceWinner,
     // called by challenger to reveal answer record
    transition reveal_answer_game
    (
        reveal_answer_notification_record: RevealAnswerNotification,
        challenger_answer_record: Answer,
        joint_piece_state: JointPieceState,
        challenger_claim_signature: ClaimSignature
    ) -> (
        RevealAnswer,
        JointPieceWinner,
        GameFinishReqNotification,
        GameFinishReqNotification,
    )
    {

        // assert that the correct state updater address is the challenger and the challenger
        // is invoking this
        assert_eq(joint_piece_state.state_updater_address, self.signer);

        // assert contracts can't call this
        assert_eq(self.caller, self.signer);

        // determine winner! If opponent correctly picked where the challenger hid alex, the opponent wins otherwise the challenger wins
        let winner_address: address = reveal_answer_notification_record.opponent_answer == challenger_answer_record.answer ? challenger_answer_record.opponent_address : challenger_answer_record.challenger_address;
        let loser_address: address = winner_address == challenger_answer_record.challenger_address ? challenger_answer_record.opponent_address : challenger_answer_record.challenger_address;
        let challenger_sig: signature = challenger_claim_signature.sig;

        // retrieve revealedanswer record logic

        // Verify that owner is challenger
        assert_eq(challenger_answer_record.owner, challenger_answer_record.challenger_address);

        // Verify signature from Cagainst message to guarantee challenger is caller
        let challenger_answer_record_msg: Message = Message {
            field_1: challenger_answer_record.message_1,
            field_2: challenger_answer_record.message_2,
            field_3: challenger_answer_record.message_3,
            field_4: challenger_answer_record.message_4,
            field_5: challenger_answer_record.message_5
        };

        let signature_check_one: bool = true;
        let is_valid_sig_one: bool = challenger_sig.verify(challenger_answer_record.challenger_address, challenger_answer_record_msg);
        assert_eq(signature_check_one, is_valid_sig_one);

        let answer_owner: address = challenger_answer_record.owner;
        let answer_challenger_address: address = challenger_answer_record.challenger_address;
        let answer_opponent_address: address = challenger_answer_record.opponent_address;
        let game_multisig: address = challenger_answer_record.game_multisig;
        let answer_amount: u64 = challenger_answer_record.amount;
        let answer_nonce: field = challenger_answer_record.nonce;
        let answer_answer: field = challenger_answer_record.answer;

        let revealed_answer_record: RevealAnswer = RevealAnswer {
            owner: game_multisig,
            challenger_address: answer_challenger_address,
            opponent_address: answer_opponent_address,
            game_multisig: game_multisig,
            amount: answer_amount,
            nonce: answer_nonce,
            answer: answer_answer,
            sig: challenger_sig
        };

        // let audit_revealed_answer_record: AuditRevealAnswer = AuditRevealAnswer {
        //     owner: puzzle_issuer,
        //     challenger_address: answer_challenger_address,
        //     opponent_address: answer_opponent_address,
        //     game_multisig: game_multisig,
        //     amount: answer_amount,
        //     nonce: answer_nonce,
        //     answer: answer_answer,
        //     sig: challenger_sig
        // };

        // update joint state update logic

        // 0. Check that owner matches
        assert_eq(joint_piece_state.owner, challenger_claim_signature.owner);

        // 1. Check that owner is the one allowed to udpate state
        assert_eq(joint_piece_state.state_updater_address, challenger_claim_signature.owner);
        assert_eq(joint_piece_state.state_updater_address, challenger_claim_signature.challenger);

        // 2. Check the rest of the details of the game
        assert_eq(joint_piece_state.amount, challenger_claim_signature.amount + challenger_claim_signature.amount );
        assert_eq(joint_piece_state.opponent, challenger_claim_signature.opponent);
        assert_eq(joint_piece_state.game_multisig, joint_piece_state.game_multisig);

        // 3. Check Claimer has verified this with a signature against the message from beginning
        let joint_piece_msg: Message = Message {
            field_1: joint_piece_state.message_1,
            field_2: joint_piece_state.message_2,
            field_3: joint_piece_state.message_3,
            field_4: joint_piece_state.message_4,
            field_5: joint_piece_state.message_5
        };

        let signature_check_two: bool = true;
        let is_valid_sig_two: bool = challenger_sig.verify(joint_piece_state.state_updater_address, joint_piece_msg);
        assert_eq(signature_check_two, is_valid_sig_two);

// The logic for the answer and computing winner is in wheres_alex program
        // The enforcement to prevent the challenger calling this function without going through
        // where's alex is via the Piece Keepers
        //
        // Logic is if a piece keeper sees that there is an address that is different from the answer record for the game,
        // then can submit to public mapping then person can not spend pieces again. Also lets you mint their amount
        // You also get a receipt to mint more pieces that you see their address has -- maybe?
        //
        // Just a simple check here to verify it's an opponent or challenger
        // check that sender is either challenger or opponent
        if winner_address == joint_piece_state.challenger {
            assert_eq(winner_address, joint_piece_state.challenger);
        } else {
            assert_eq(winner_address, joint_piece_state.opponent);
        }

        let joint_piece_winner: JointPieceWinner = JointPieceWinner {
            owner: joint_piece_state.game_multisig,
            amount: joint_piece_state.amount,
            time_claimer_address: joint_piece_state.time_claimer_address,
            state_updater_address: joint_piece_state.state_updater_address,
            challenger: joint_piece_state.challenger,
            opponent: joint_piece_state.opponent,
            game_multisig: joint_piece_state.game_multisig,
            winner: winner_address
        };

        // for the piece keepers
        // let audit_joint_piece_winner: AuditJointPieceWinner = AuditJointPieceWinner {
        //     owner: joint_piece_state.game_multisig,
        //     amount: joint_piece_state.amount,
        //     time_claimer_address: joint_piece_state.time_claimer_address,
        //     state_updater_address: joint_piece_state.state_updater_address,
        //     challenger: joint_piece_state.challenger,
        //     opponent: joint_piece_state.opponent,
        //     game_multisig: joint_piece_state.game_multisig,
        //     winner: winner_address
        // };

        // notification logic
        let game_finish_req_notification_record_opponent: GameFinishReqNotification = GameFinishReqNotification {
            owner: challenger_answer_record.opponent_address,
            game_multisig: challenger_answer_record.game_multisig,
            game_state: 4field,
            your_turn: true,
            total_pot: joint_piece_state.amount,
            challenger_address: challenger_answer_record.challenger_address,
            opponent_address: challenger_answer_record.opponent_address,
            challenger_answer: challenger_answer_record.answer,
            opponent_answer: reveal_answer_notification_record.opponent_answer,
            winner: winner_address,
            loser: loser_address
        };

        let game_finish_req_notification_record_challenger: GameFinishReqNotification = GameFinishReqNotification{
            owner: challenger_answer_record.challenger_address,
            game_multisig: challenger_answer_record.game_multisig,
            game_state: 4field,
            your_turn: true,
            total_pot: joint_piece_state.amount,
            challenger_address: challenger_answer_record.challenger_address,
            opponent_address: challenger_answer_record.opponent_address,
            challenger_answer: challenger_answer_record.answer,
            opponent_answer: reveal_answer_notification_record.opponent_answer,
            winner: winner_address,
            loser: loser_address
        };

        return (
            revealed_answer_record,
            // audit_revealed_answer_record,
            joint_piece_winner,
            // audit_joint_piece_winner,
            game_finish_req_notification_record_opponent,
            game_finish_req_notification_record_challenger
        );
    }

    // todo: add below back as outputs
    // AuditTransferToWinner,
    // AuditPieceOwner,
    // called by ms key to finish the game and get the total pot!
    transition finish_game
    (
        game_record: Game,
        joint_piece_winner: JointPieceWinner,
        piece_joint_stake: PieceJointStake,
        joint_piece_time_claim: JointPieceTimeClaim,
    ) -> (
        Piece,
        Game,
        GameFinishedNotification,
        GameFinishedNotification)
    {

        // assert that the game address/multiisg is calling this
        assert_eq(game_record.owner, self.signer);

        // assert contracts can't call this
        assert_eq(self.caller, self.signer);

        let loser_address: address = joint_piece_winner.winner == game_record.challenger_address ? game_record.opponent_address : game_record.challenger_address;

        // transfer to winner logic

        // 0. Add a self.signer check against
        let game_multisig: address = joint_piece_winner.owner;
        // assert_eq(owner, self.signer);

        // 1. Check that all are from the same multisig
        assert_eq(piece_joint_stake.owner, game_multisig);
        assert_eq(joint_piece_time_claim.owner, game_multisig);

        // 2. Check that the game state is the same for all
        let amount: u64 = joint_piece_winner.amount;
        assert_eq(piece_joint_stake.amount, amount);
        assert_eq(joint_piece_time_claim.amount, amount);

        let challenger: address = joint_piece_winner.challenger;
        assert_eq(piece_joint_stake.state_updater_address, challenger);
        assert_eq(joint_piece_time_claim.challenger, challenger);

        let opponent: address = joint_piece_winner.opponent;
        assert_eq(piece_joint_stake.time_claimer_address, opponent);
        assert_eq(joint_piece_time_claim.opponent, opponent);

        // Check that winner is challenger or opponent
        let winner: address = joint_piece_winner.winner;
        if winner == piece_joint_stake.time_claimer_address {
            assert_eq(winner, piece_joint_stake.time_claimer_address);
        } else {
            assert_eq(winner, piece_joint_stake.state_updater_address);
        }

        let piece_to_winner_record: Piece = Piece {
            owner: winner,
            amount: amount
        };

        // let audit_transfer_to_winner_record: AuditTransferToWinner = AuditTransferToWinner {
        //     owner: puzzle_issuer,
        //     challenger: challenger,
        //     opponent: opponent,
        //     game_multisig: game_multisig,
        //     receiver: winner,
        //     amount: amount
        // };

        // let audit_piece_owner_record: AuditPieceOwner = AuditPieceOwner {
        //     owner: puzzle_issuer,
        //     piece_holder: winner,
        //     amount: amount
        // };

        // update game and finish game notification logic
        let updated_game_record: Game = Game {
            owner: game_record.owner,
            challenger_commit: game_record.challenger_commit,
            opponent_answer: game_record.opponent_answer,
            total_pot: game_record.total_pot,
            challenger_address: game_record.challenger_address,
            opponent_address: game_record.opponent_address,
            game_multisig: game_record.game_multisig,
            game_state: 5field
        };

        let game_finished_notification_challenger_record: GameFinishedNotification = GameFinishedNotification {
            owner: game_record.challenger_address,
            game_multisig: game_record.game_multisig,
            game_state: 5field,
            your_turn: false,
            total_pot: game_record.total_pot,
            challenger_address: game_record.challenger_address,
            opponent_address: game_record.opponent_address,
            winner: joint_piece_winner.winner,
            loser: loser_address
        };

        let game_finished_notification_opponent_record: GameFinishedNotification = GameFinishedNotification {
            owner: game_record.opponent_address,
            game_multisig: game_record.game_multisig,
            game_state: 5field,
            your_turn: false,
            total_pot: game_record.total_pot,
            challenger_address: game_record.challenger_address,
            opponent_address: game_record.opponent_address,
            winner: joint_piece_winner.winner,
            loser: loser_address
        };

        return (
            piece_to_winner_record,
            // audit_transfer_to_winner_record,
            // audit_piece_owner_record,
            updated_game_record,
            game_finished_notification_challenger_record,
            game_finished_notification_opponent_record
        );
    }

    // todo: add below back as output
    // AuditTransferToWinner,
    // called by ms key via opponent to finish the game and get the total pot!
    async transition finish_game_by_timeout(
        game_record: Game,
        piece_joint_stake: PieceJointStake,
        joint_piece_time_claim: JointPieceTimeClaim,
        opponent_sig: signature, // use from ClaimSignature record on FE, can't consume in this fxn bc claim is owned by multisig
    ) -> (
        Piece,
        Game,
        GameFinishedNotification,
        GameFinishedNotification,
        Future
      )
    {
        // assert that the game address/multiisg is calling this
        assert_eq(game_record.owner, self.signer);

        // assert contracts can't call this
        assert_eq(self.caller, self.signer);

        // Update the game state
        let updated_game_record: Game = Game {
            owner: game_record.owner,
            challenger_commit: game_record.challenger_commit,
            opponent_answer: game_record.opponent_answer,
            total_pot: game_record.total_pot,
            challenger_address: game_record.challenger_address,
            opponent_address: game_record.opponent_address,
            game_multisig: game_record.game_multisig,
            game_state: 6field
        };

        // Notification to challenger of game finished
        let game_finished_notification_challenger_record: GameFinishedNotification = GameFinishedNotification {
            owner: game_record.challenger_address,
            game_multisig: game_record.game_multisig,
            game_state: 6field,
            your_turn: false,
            total_pot: game_record.total_pot,
            challenger_address: game_record.challenger_address,
            opponent_address: game_record.opponent_address,
            winner: game_record.opponent_address,
            loser: game_record.challenger_address
        };

        // Notification to opponent of game finished
        let game_finished_notification_opponent_record: GameFinishedNotification = GameFinishedNotification {
            owner: game_record.opponent_address,
            game_multisig: game_record.game_multisig,
            game_state: 6field,
            your_turn: false,
            total_pot: game_record.total_pot,
            challenger_address: game_record.challenger_address,
            opponent_address: game_record.opponent_address,
            winner: game_record.opponent_address,
            loser: game_record.challenger_address
        };

        // Payout to winner

        // 1. Check that all are from the same multisig
        let game_multisig: address = joint_piece_time_claim.owner;
        assert_eq(piece_joint_stake.owner, game_multisig);

        // 2. Check that the game state is the same for all
        let amount: u64 = joint_piece_time_claim.amount;
        assert_eq(piece_joint_stake.amount, amount);

        // 2. Check that the game state is the same for all
        let challenger: address = joint_piece_time_claim.challenger;
        assert_eq(piece_joint_stake.state_updater_address, challenger);

        let opponent: address = joint_piece_time_claim.opponent;
        assert_eq(piece_joint_stake.time_claimer_address, opponent);

        // 3. Check Claimer has verified this with a signature against the message from beginning
        // FE -- use the claim signature record for opponent address here to fill in
        let msg: Message = Message {
            field_1: joint_piece_time_claim.message_1,
            field_2: joint_piece_time_claim.message_2,
            field_3: joint_piece_time_claim.message_3,
            field_4: joint_piece_time_claim.message_4,
            field_5: joint_piece_time_claim.message_5
        };

        let signature_check: bool = true;
        let is_valid_sig: bool = opponent_sig.verify(joint_piece_time_claim.time_claimer_address, msg);
        assert_eq(signature_check, is_valid_sig);


        let piece_record_winner: Piece = Piece {
            owner: opponent,
            amount: amount
        };

        // let audit_transfer_to_winner_record: AuditTransferToWinner = AuditTransferToWinner {
        //     owner: puzzle_issuer,
        //     challenger: challenger,
        //     opponent: opponent,
        //     game_multisig: game_multisig,
        //     receiver: opponent,
        //     amount: amount
        // };

        return (
            piece_record_winner,
            // audit_transfer_to_winner_record,
            updated_game_record,
            game_finished_notification_challenger_record,
            game_finished_notification_opponent_record,
            finalize_finish_game_by_timeout(joint_piece_time_claim.block_ht)
        );
    }

    async function finalize_finish_game_by_timeout(joint_time_claim_block_ht: u32) {
        // assert that 1000 blocks have passed (~ 83 minutes)
        let current_block_ht: u32 = block.height;
        let threshold_block_ht: u32 = joint_time_claim_block_ht + 10000u32;
        assert(current_block_ht > threshold_block_ht);
    }
}
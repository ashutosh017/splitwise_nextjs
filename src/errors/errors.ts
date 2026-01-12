import { AppError } from "./app_error";

export class UnauthorizedError<T extends string> extends AppError {
    constructor(msg?: T) {
        super("UNAUTHORIZED", 401, msg ?? "User is not authorized");
    }
}

export class MemberAlreadyExistsError extends AppError {
    constructor() {
        super("MEMBER_ALREADY_EXISTS", 409, "User already exists");
    }
}

export class MemberNotFoundError extends AppError {
    constructor() {
        super("MEMBER_NOT_FOUND", 404, "User does not exist");
    }
}

export class GroupNotFoundError extends AppError {
    constructor() {
        super("GROUP_NOT_FOUND", 404, "Group does not exist");
    }
}

export class MemberAlreadyInGroupError extends AppError {
    constructor() {
        super(
            "MEMBER_ALREADY_IN_GROUP",
            409,
            "Member already exists in group"
        );
    }
}

export class MemberNotInGroupError extends AppError {
    constructor() {
        super(
            "MEMBER_NOT_IN_GROUP",
            404,
            "Member does not exist in group"
        );
    }
}

export class ExpenseNotFoundError extends AppError {
    constructor() {
        super(
            "EXPENSE_NOT_FOUND",
            404,
            "Expense details not found"
        )
    }
}
export class BalanceNotFoundError extends AppError {
    constructor() {
        super(
            "BALANCE_NOT_FOUND",
            404,
            "Balance details not found"
        )
    }
}

export class InvalidAmountError extends AppError {
    constructor() {
        super(
            "INVALID_AMOUNT",
            400,
            "Amount must be greater than zero"
        );
    }
}
export class InsufficientBalanceError extends AppError {
    constructor() {
        super(
            "INSUFFICIENT_BALANCE",
            409,
            "Insufficient balance to perform this operation"
        );
    }
}
export class DuplicateMembersInSplitsArrayError extends AppError {
    constructor() {
        super(
            "DUPLICATE_MEMBER_IDS_FOUND",
            409,
            "Duplicate Ids found in Splits Array"
        );
    }
}
export class EmptySplitsArrayError extends AppError {
    constructor() {
        super(
            "EMPTY_SPLITS_ARRAY",
            409,
            "Splits array cannot be empty"
        );
    }
} export class InvalidSplitValueError extends AppError {
    constructor() {
        super(
            "INVALID_SPLIT_VALUE",
            400,
            "Invalid split value provided"
        );
    }
}
export class SplitAmountMismatchError extends AppError {
    constructor() {
        super(
            "SPLIT_AMOUNT_MISMATCH",
            400,
            "Split amounts do not add up to the total expense amount"
        );
    }
}
export class PercentageSplitNotEqualTo100Error extends AppError {
    constructor() {
        super(
            "PERCENTAGE_SPLIT_NOT_100",
            400,
            "Percentage splits must add up to 100%"
        );
    }
}

export class PasswordsDoesNotMatchError extends AppError {
    constructor() {
        super("PASSWORDS_DOES_NOT_MATCH", 401, "Passwords did not match")
    }
}

export class SplitsNotFoundError extends AppError {
    constructor() {
        super("SPLITS_NOT_EXISTS", 404, "Splits does not found for this perticular expense id")
    }
}

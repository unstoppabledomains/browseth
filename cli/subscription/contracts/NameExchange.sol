pragma solidity ^0.4.23;

contract Transferer {
    function transfer(bytes32 label, address newOwner) public;
}

contract PreviousOwnerer {
    function previousOwner() public returns (address);
}

contract Token {
    function transfer(address to, uint256 value) public returns (bool);
    function transferFrom(address from, address to, uint256 value) public returns (bool);
}

library SafeMath {
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        assert(b <= a);
        return a - b;
    }

    function add(uint256 a, uint256 b) internal pure returns (uint256 c) {
        c = a + b;
        assert(c >= a);
        return c;
    }
}

contract NameExchange {

    using SafeMath for uint256;

    event Deposit(address token, address from, uint256 amount, uint256 total);
    event Withdraw(address token, address from, uint256 amount, uint256 total);
    event DepositName(address from, bytes32 label);
    event WithdrawName(address from, bytes32 label);
    event Order(bytes32 label, address token, uint256 amount);
    event Filled(bytes32 label, address token, uint256 amount);

    struct OrderT {
        uint256 amount;
        uint256 expiresAt;
    }

    bytes32 constant approveSignature = keccak256("approve(address,uint256)");
    bytes32 constant depositEtherSignature = keccak256("depositEther()");
    bytes32 constant depositTokensSignature = keccak256(
        "depositTokens(address,uint256)"
    );
    bytes32 constant fillSignature = keccak256("fill(address,bytes32,address)");
    bytes32 constant transferSignature = keccak256("transfer(bytes32,address)");

    Transferer public registrar;

    mapping (address => mapping (address => uint256)) public balanceOf;
    mapping (address => mapping (bytes32 => bool)) public name;
    mapping (bytes32 => mapping (address => OrderT)) public orderOf;

    constructor (address initialRegistrar) public {
        registrar = Transferer(initialRegistrar);
    }

    function () external {}

    function setRegistrar(address newRegistrar) external {
        registrar = Transferer(newRegistrar);
    }

    function depositTokens(address token, uint256 amount) external {
        require(token != 0x0);

        // require(token.delegatecall(approveSignature, this, amount));
        require(Token(token).transferFrom(msg.sender, this, amount));

        balanceOf[token][msg.sender] = balanceOf[token][msg.sender].add(amount);

        emit Deposit(token, msg.sender, amount, balanceOf[token][msg.sender]);
    }

    function withdrawTokens(address token, uint256 amount) external {
        balanceOf[token][msg.sender] = balanceOf[token][msg.sender].sub(amount);

        require(Token(token).transfer(msg.sender, amount));

        emit Withdraw(token, msg.sender, amount, balanceOf[token][msg.sender]);
    }

    function depositEther() external payable {
        balanceOf[0][msg.sender] = balanceOf[0][msg.sender].add(msg.value);

        emit Deposit(0, msg.sender, msg.value, balanceOf[0][msg.sender]);
    }

    function withdrawEther(uint256 amount) external {
        balanceOf[0][msg.sender] = balanceOf[0][msg.sender].sub(amount);

        msg.sender.transfer(amount);

        emit Withdraw(0, msg.sender, amount, balanceOf[0][msg.sender]);
    }

    function withdrawName(bytes32 label) external {
        require(name[msg.sender][label]);

        registrar.transfer(label, msg.sender);

        name[msg.sender][label] = false;

        emit WithdrawName(msg.sender, label);
    }

    function order(
        bytes32 label,
        address token,
        uint256 amount,
        uint256 expiresAt
    ) external {
        require(name[msg.sender][label]);

        orderOf[label][token] = OrderT(amount, expiresAt);

        emit Order(label, token, amount);
    }

    function fill(
        address from,
        bytes32 label,
        address token
    ) external {
        require(name[from][label]);

        OrderT storage o = orderOf[label][token];

        require(o.amount > 0);
        require(o.expiresAt > block.timestamp);

        registrar.transfer(label, msg.sender);
        name[msg.sender][label] = false;

        balanceOf[token][msg.sender] = balanceOf[token][msg.sender].sub(
            o.amount
        );
        balanceOf[token][from] = balanceOf[token][from].add(o.amount);

        emit Filled(label, token, o.amount);
    }
}

contract Name {
    struct Order {
        uint32 timestamp;
    }
}
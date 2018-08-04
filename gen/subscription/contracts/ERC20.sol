pragma solidity ^0.4.23;

// interface ERC20Interface {
//     function totalSupply() public view returns (uint);
//     function balanceOf(address) public view returns (uint);
//     function allowance(address tokenOwner, address spender) public view returns (uint);
//     function transfer(address to, uint tokens) public returns (bool success);
//     function approve(address spender, uint tokens) public returns (bool success);
//     function transferFrom(address from, address to, uint tokens) public returns (bool success);

//     event Transfer(address indexed from, address indexed to, uint tokens);
//     event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
// }

// contract TokenContractFragment is ERC20Interface {
//     mapping(address => uint256) balanceOf;
//     mapping(address => mapping (address => uint256)) allowed;

//     function transfer(address to, uint tokens) public returns (bool success) {
//         balanceOf[msg.sender] = balanceOf[msg.sender].sub(tokens);
//         balanceOf[to] = balanceOf[to].add(tokens);
//         emit Transfer(msg.sender, to, tokens);
//         return true;
//     }
//     function transferFrom(address from, address to, uint tokens) public returns (bool success) {
//         balanceOf[from] = balanceOf[from].sub(tokens);
//         allowed[from][msg.sender] = allowed[from][msg.sender].sub(tokens);
//         balanceOf[to] = balanceOf[to].add(tokens);
//         emit Transfer(from, to, tokens);
//         return true;
//     }
//     function approve(address spender, uint tokens) public returns (bool success) {
//         allowed[msg.sender][spender] = tokens;
//         emit Approval(msg.sender, spender, tokens);
//         return true;
//     }
// }
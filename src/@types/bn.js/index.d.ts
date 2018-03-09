declare module 'bn.js' {
  import {Buffer} from 'buffer';

  type Endianness = 'le' | 'be';
  type IPrimeName = 'k256' | 'p224' | 'p192' | 'p25519';

  class RedBN {
    redAdd(b: RedBN): RedBN;
    redIAdd(b: RedBN): RedBN;
    redSub(b: RedBN): RedBN;
    redISub(b: RedBN): RedBN;
    redShl(num: number): RedBN;
    redMul(b: RedBN): RedBN;
    redIMul(b: RedBN): RedBN;
    redSqr(): RedBN;
    redISqr(): RedBN;
    redSqrt(): RedBN;
    redInvm(): RedBN;
    redNeg(): RedBN;
    redPow(b: RedBN): RedBN;
    fromRed(): BN;
  }

  // FIXME: not sure how to specify the reduction context here
  interface IReductionContext {
    m: number;
    prime: object;
    [key: string]: any;
  }

  export default class BN {
    constructor(
      number: number | string | number[] | Buffer | BN,
      base?: number,
      endian?: Endianness,
    );

    static red(reductionContext: BN | IPrimeName): IReductionContext;
    static mont(num: BN): IReductionContext;
    static isBN(b: object): boolean;

    toRed(reductionContext: IReductionContext): RedBN;
    clone(): BN;
    toString(base?: number | 'hex', length?: number): string;
    toNumber(): number;
    toJSON(): string;
    toArray(endian?: Endianness, length?: number): number[];
    toArrayLike(
      ArrayType: Buffer | Array<any>,
      endian?: Endianness,
      length?: number,
    ): Buffer | Array<any>;
    toBuffer(endian?: Endianness, length?: number): Buffer;
    bitLength(): number;
    zeroBits(): number;
    byteLength(): number;
    isNeg(): boolean;
    isEven(): boolean;
    isOdd(): boolean;
    isZero(): boolean;
    cmp(b: BN): -1 | 0 | 1;
    ucmp(b: BN): -1 | 0 | 1;
    cmpn(b: number): -1 | 0 | 1;
    lt(b: BN): boolean;
    ltn(b: number): boolean;
    lte(b: BN): boolean;
    lten(b: number): boolean;
    gt(b: BN): boolean;
    gtn(b: number): boolean;
    gte(b: BN): boolean;
    gten(b: number): boolean;
    eq(b: BN): boolean;
    eqn(b: number): boolean;
    toTwos(width: number): BN;
    fromTwos(width: number): BN;
    neg(): BN;
    ineg(): BN;
    abs(): BN;
    iabs(): BN;
    add(b: BN): BN;
    iadd(b: BN): BN;
    addn(b: number): BN;
    iaddn(b: number): BN;
    sub(b: BN): BN;
    isub(b: BN): BN;
    subn(b: number): BN;
    isubn(b: number): BN;
    mul(b: BN): BN;
    imul(b: BN): BN;
    muln(b: number): BN;
    imuln(b: number): BN;
    sqr(): BN;
    isqr(): BN;
    pow(b: BN): BN;
    div(b: BN): BN;
    divn(b: number): BN;
    idivn(b: number): BN;
    mod(b: BN): BN;
    umod(b: BN): BN;

    //API consistency https://github.com/indutny/bn.js/pull/130
    modn(b: number): number;
    divRound(b: BN): BN;
    or(b: BN): BN;
    ior(b: BN): BN;
    uor(b: BN): BN;
    iuor(b: BN): BN;
    and(b: BN): BN;
    iand(b: BN): BN;
    uand(b: BN): BN;
    iuand(b: BN): BN;
    andln(b: number): BN;
    xor(b: BN): BN;
    ixor(b: BN): BN;
    uxor(b: BN): BN;
    iuxor(b: BN): BN;
    setn(b: number): BN;
    shln(b: number): BN;
    ishln(b: number): BN;
    ushln(b: number): BN;
    iushln(b: number): BN;
    shrn(b: number): BN;
    ishrn(b: number): BN;
    ushrn(b: number): BN;
    iushrn(b: number): BN;
    testn(b: number): boolean;
    maskn(b: number): BN;
    imaskn(b: number): BN;
    bincn(b: number): BN;
    notn(w: number): BN;
    inotn(w: number): BN;
    gcd(b: BN): BN;
    egcd(b: BN): {a: BN; b: BN; gcd: BN};
    invm(b: BN): BN;
  }
}

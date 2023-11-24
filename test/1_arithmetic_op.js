const chai = require("chai")
const path = require("path")
const F1Field = require("ffjavascript").F1Field
const Scalar = require("ffjavascript").Scalar
exports.p = Scalar.fromString("0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaab") // BLS12-381 prime
const Fr = new F1Field(exports.p)
const wasm_tester = require("circom_tester").wasm
const assert = chai.assert
const MAX_VALUE = Scalar.fromString("115792089237316195423570985008687907853269984665640564039457584007913129639935") // 2**256 - 1

describe("0x01 ADD test", function ()  {
  let circuit;
  let witness;
  before( async () => {
    circuit = await wasm_tester(path.join(__dirname, "circuits", "add_test.circom"))
  })
  it("Should equal to sum of two small inputs", async() => {
    const input = [20, 6]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(input[0] + input[1])))
  })
  it("Should equal to sum of two big enough inputs", async() => {
    const input = [
      MAX_VALUE + Scalar.fromString("1"), 
      MAX_VALUE + Scalar.fromString("1")
    ]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(input[0] + input[1])))
  })
  it("Should equal to zero", async() => {
    const input = [
      Scalar.fromString("1"),
      exports.p - Scalar.fromString('1')
    ]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
})


describe("0x02 MUL test", function ()  {
  let circuit;
  let witness;
  before( async () => {
    circuit = await wasm_tester(path.join(__dirname, "circuits", "mul_test.circom"))
  })
  it("Should equal to product of two small inputs", async() => {
    const input = [20, 9]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(input[0] * input[1])))
  })
  it("Should equal to product of two big enough inputs", async() => {
    const input = [
      MAX_VALUE + Scalar.fromString("1"),
      Scalar.fromString("81221")
    ]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(input[0] * input[1])))
  })
  it("Should equal to zero", async() => {
    const input = [
      exports.p - Scalar.fromString('1'),
      Scalar.fromString("0")
    ]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
})
describe("0x03 SUB test", function ()  {
  let circuit;
  let witness;
  before( async () => {
    circuit = await wasm_tester(path.join(__dirname, "circuits", "sub_test.circom"))
  })
  it("Should equal to subtraction of smaller number from large number", async() => {
    const input = [20, 9]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(input[0] - input[1])))
  })
  it("Should equal to subtraction of larger number from small number", async() => {
    const input = [1, 1000]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(input[0] - input[1])))
  })
  it("Should equal to zero", async() => {
    const input = [
      exports.p - Scalar.fromString('1'),
      exports.p - Scalar.fromString('1')
    ]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
})
describe("0x04 DIV test", function ()  {
  let circuit;
  let witness;
  before( async () => {
    circuit = await wasm_tester(path.join(__dirname, "circuits", "div_test.circom"))
  })
  it("Should equal to zero", async() => {
    const input = [9, 20]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))

  })
  it("Should equal to zero", async() => {
    const input = [0, 1000]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
  it("Should equal to one", async() => {
    const input = [
      exports.p - Scalar.fromString('1'),
      exports.p - Scalar.fromString('1')
    ]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(1)))
  })
  it("Should equal to zero; divide by zero", async() => {
    const input = [10, 0]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
  it("Should equal to zero; divide by zero", async() => {
    const input = [
      MAX_VALUE,
      Scalar.fromString('0')
    ]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
})

describe("0x05 SDIV test", function ()  {
  let circuit;
  let witness;
  before( async () => {
    circuit = await wasm_tester(path.join(__dirname, "circuits", "sdiv_test.circom"))
  })
  it("Should equal to zero", async() => {
    const input = [9, 20]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
  it("Should equal to positive two", async() => {
    const input = [20, 9]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(2)))
  })
  it("Should equal to negative two", async() => {
    const input = [
      MAX_VALUE + Scalar.fromString('1') - Scalar.fromString('7'),
      Scalar.fromString('3')
    ]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(MAX_VALUE - Scalar.fromString('1'))))
  })
  it("Should equal to negative two", async() => {
    const input = [
      Scalar.fromString('7'),
      MAX_VALUE + Scalar.fromString('1') - Scalar.fromString('3')
    ]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(MAX_VALUE - Scalar.fromString('1'))))
  })
  it("Should equal to positive two", async() => {
    const input = [
      MAX_VALUE + Scalar.fromString('1') - Scalar.fromString('7'),
      MAX_VALUE + Scalar.fromString('1') - Scalar.fromString('3')
    ]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(2)))
  })
  it("Should equal to zero: devide by zero", async() => {
    const input = [100, 0]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
  it("Should equal to zero: devide by zero", async() => {
    const input = [
      Scalar.fromString('7237005577332262213973186563042994240829374041602535252466099000494570602495'),
      0
    ]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
  it("Should equal to zero; divide by zero", async() => {
    const input = [
      MAX_VALUE, // -1
      Scalar.fromString('0')
    ]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
  it("Should equal to -2^252", async() => {
    const input = [
      Scalar.fromString('7237005577332262213973186563042994240829374041602535252466099000494570602496'), // -2^252
      MAX_VALUE
    ]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(input[0])))
  })
})

describe("0x06 MOD test", function ()  {
  let circuit;
  let witness;
  before( async () => {
    circuit = await wasm_tester(path.join(__dirname, "circuits", "mod_test.circom"))
  })
  it("Should equal to dividend", async() => {
    const input = [9, 20]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), input[0] % input[1]))

  })
  it("Should equal to zero", async() => {
    const input = [0, 1000]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
  it("Should equal to zero", async() => {
    const input = [
      exports.p - Scalar.fromString('1'),
      exports.p - Scalar.fromString('1')
    ]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
  it("Should equal to zero: divide by zero", async() => {
    const input = [1000, 0]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
  it("Should equal to zero; divide by zero", async() => {
    const input = [
      MAX_VALUE,
      Scalar.fromString('0')
    ]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
})

describe("0x07 SMOD test", function ()  {
  let circuit;
  let witness;
  before( async () => {
    circuit = await wasm_tester(path.join(__dirname, "circuits", "smod_test.circom"))
  })
  it("Should equal to the first input", async() => {
    const input = [9, 20]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(input[0])))
  })
  it("Should equal to positive two", async() => {
    const input = [20, 9]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(input[0] % input[1])))
  })
  it("Should equal to negative one", async() => {
    const input = [
      MAX_VALUE + Scalar.fromString('1') - Scalar.fromString('7'),
      Scalar.fromString('3')
    ]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(MAX_VALUE)))
  })
  it("Should equal to negative one", async() => {
    const input = [
      Scalar.fromString('7'),
      MAX_VALUE + Scalar.fromString('1') - Scalar.fromString('3')
    ]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(MAX_VALUE)))
  })
  it("Should equal to positive one", async() => {
    const input = [
      MAX_VALUE + Scalar.fromString('1') - Scalar.fromString('7'),
      MAX_VALUE + Scalar.fromString('1') - Scalar.fromString('3')
    ]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(1)))
  })
  it("Should equal to zero: divide by zero", async() => {
    const input = [1000, 0]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
  it("Should equal to zero; divide by zero", async() => {
    const input = [
      Scalar.fromString('7237005577332262213973186563042994240829374041602535252466099000494570602495'),
      Scalar.fromString('0')
    ]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
  it("Should equal to zero; divide by zero", async() => {
    const input = [
      MAX_VALUE, // -1
      Scalar.fromString('0')
    ]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
})

describe("0x08 ADDMOD test", function ()  {
  let circuit;
  let witness;
  before( async () => {
    circuit = await wasm_tester(path.join(__dirname, "circuits", "addmod_test.circom"))
  })
  it("Should equal to modular of summation of first two inputs", async() => {
    const input = [9, 20, 7]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e((input[0] + input[1]) % input[2])))
  })
  it("Should equal to zero", async() => {
    const input = [0, 0, 7]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
  it("Should equal to zero", async() => {
    const input = [
      exports.p - Scalar.fromString('1'),
      Scalar.fromString("1"),
      Scalar.fromString("17")
    ]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
  it("Should equal to zero: divide by zero", async() => {
    const input = [10, 1, 0]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
  it("Should equal to zero: divide by zero", async() => {
    const input = [
      MAX_VALUE,
      Scalar.fromString('1'),
      Scalar.fromString('0')
    ]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
})

describe("0x09 MULMOD test", function ()  {
  let circuit;
  let witness;
  before( async () => {
    circuit = await wasm_tester(path.join(__dirname, "circuits", "mulmod_test.circom"))
  })
  it("Should equal to modular of multiplication of first two inputs", async() => {
    const input = [9, 20, 7]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e((input[0] * input[1]) % input[2])))
  })
  it("Should equal to zero", async() => {
    const input = [0, 0, 7]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
  it("Should equal to zero", async() => {
    const input = [
      exports.p,
      Scalar.fromString("1"),
      Scalar.fromString("17")
    ]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
  it("Should equal to zero: divide by zero", async() => {
    const input = [10, 1, 0]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
  it("Should equal to zero: divide by zero", async() => {
    const input = [
      MAX_VALUE,
      Scalar.fromString('2'),
      Scalar.fromString('0')
    ]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
})

describe("0x0A EXP test", function ()  {
  let circuit;
  let witness;
  before( async () => {
    circuit = await wasm_tester(path.join(__dirname, "circuits", "exp_test.circom"))
  })
  it("Should equal to pow(a, b)", async() => {
    const input = [9, 5]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(Math.pow(input[0], input[1]))))
  })
  it("Should equal to one", async() => {
    const input = [1, 100]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(1)))
  })
  it("Should equal to one", async() => {
    const input = [17, 0]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(1)))
  })
  it("Should equal to zero", async() => {
    const input = [0, 100]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(0)))
  })
  it("Should equal to one", async() => {
    const input = [0, 0]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(1)))
  })
})
// 0x0B SINGEXTEND

describe("0x0B SIGNEXTEND test", function ()  {
  let circuit;
  let witness;
  before( async () => {
    circuit = await wasm_tester(path.join(__dirname, "circuits", "signextend_test.circom"))
  })
  it("Should equal to signextend", async() => {
    const input = [0, 127]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(
      Fr.eq(
        Fr.e(witness[1]), 
        Fr.e(input[1])
      )
    )
  })
  it("Should equal to signextend", async() => {
    const input = [1, 2**15]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(
      Fr.eq(
        Fr.e(witness[1]), 
        Fr.e(Fr.e(2**253) - Fr.e(2**16) + Fr.e(input[1]))
      )
    )
  })
  it("Should equal to the original input", async() => {
    const input = [32, 2**15]
    witness = await circuit.calculateWitness({"in": input}, true)
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)))
    assert(
      Fr.eq(
        Fr.e(witness[1]), 
        Fr.e(input[1])
      )
    )
  })
})
pragma circom 2.1.6;

template Add () {
    signal input in[2];
    signal inter;
    signal output out;

    inter <-- 1;
    out <== (in[0] + in[1]) * inter;
}
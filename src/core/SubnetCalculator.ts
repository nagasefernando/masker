import BitSequence from "./BitSequence";
import { ipToNumber, numberToIp } from "../util/IpUtils";

export default class SubnetCalculator {
    _ipAddress: BitSequence;
    _subnetMask: BitSequence;

    constructor(ipAddress: string, subnetMask: string) {
        this._ipAddress = new BitSequence(
            ipToNumber(ipAddress).toString(2).padStart(32, '0'),
            32
        );
        this._subnetMask = new BitSequence(
            ipToNumber(subnetMask).toString(2).padStart(32, '0'),
            32
        );
    }

    get firstHostAddress() {
        const netAddressQuartets = this.subnetAddress.split('.');
        netAddressQuartets[3] = `${+netAddressQuartets[3] + 1}`;
        return netAddressQuartets.join('.');
    }

    get lastHostAddress() {
        const netAddressQuartets = this.broadcastAddress.split('.');
        netAddressQuartets[3] = `${+netAddressQuartets[3] - 1}`;
        return netAddressQuartets.join('.');
    }

    get hostAddressRange() {
        return `${this.firstHostAddress} - ${this.lastHostAddress}`;
    }

    get maxSubnets(): number {
        return 1;
    }

    get maxAddresses(): number {
        const hostBits = this._subnetMask.invert().sequence
            .toString(2).split('').length;

        return 2 ** hostBits;
    }

    get maxHosts(): number {
        return this.maxAddresses - 2;
    }

    get subnetAddress() {
        return numberToIp(this._ipAddress.and(this._subnetMask).sequence);
    }

    get broadcastAddress() {
        return numberToIp(this._ipAddress.or(
            new BitSequence((~this._subnetMask.sequence) >>> 0, 32)
        ).sequence);
    }
}
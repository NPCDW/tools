var Snowflake = function(_workerId, _dataCenterId) {
    // 开始时间（算法存储的时间为当前时间减去开始时间的差值），单位毫秒
    this.twepoch = 1577808000000;   // 2020-01-01 00:00:00.000
    this.workerIdBits = 5;  // 机器ID 5 位，范围 0~31
    this.dataCenterIdBits = 5;  // 数据中心ID 5 位，范围 0~31
    this.maxWrokerId = -1 ^ (-1 << this.workerIdBits); // 机器ID最大值为：31
    this.maxDataCenterId = -1 ^ (-1 << this.dataCenterIdBits); // 数据中心ID最大值为：31
    this.sequenceBits = 12; // 序列（如果时间相同，机器ID相同，数据中心ID相同，则会使用序列区分） 12 位，范围 0~4095
    this.workerIdShift = this.sequenceBits; // 机器ID位移量值为：12
    this.dataCenterIdShift = this.sequenceBits + this.workerIdBits; // 数据中心ID位移量值为：17
    this.timestampLeftShift = this.sequenceBits + this.workerIdBits + this.dataCenterIdBits; // 相对时间戳位移量值为：22
    this.sequenceMask = -1 ^ (-1 << this.sequenceBits); // 序列最大值为：4095
    this.lastTimestamp = -1; // 最后生成的时间戳，防止时钟回拨
    this.workerId = _workerId ? _workerId : 1;
    this.dataCenterId = _dataCenterId ? _dataCenterId : 1;
    this.sequence = 0;
    if (this.workerId > this.maxWrokerId || this.workerId < 0) {
        throw new Error('config.worker_id must max than 0 and small than maxWrokerId-[' + this.maxWrokerId + ']');
    }
    if (this.dataCenterId > this.maxDataCenterId || this.dataCenterId < 0) {
        throw new Error('config.data_center_id must max than 0 and small than maxDataCenterId-[' + this.maxDataCenterId + ']');
    }
}
// 等待，直到下一毫秒
Snowflake.prototype.tilNextMillis = function(lastTimestamp) {
    let timestamp = this.timeGen();
    while (timestamp <= lastTimestamp) {
        timestamp = this.timeGen();
    }
    return timestamp;
};
// 获取时间戳
Snowflake.prototype.timeGen = function() {
    return Date.now();
};
// 生成ID，如果异步调用仍然会生成重复ID，js没有 synchronize 关键字，无法使多线程同步
Snowflake.prototype.nextId = function() {
    let timestamp = this.timeGen();
    // 如果时钟回拨，拒绝生成ID
    if (timestamp < this.lastTimestamp) {
        throw new Error('Clock moved backwards. Refusing to generate id for ' +
            (this.lastTimestamp - timestamp));
    }
    // 如果上次生成ID和本次生成ID落在同一毫秒中，则通过序列号自增来保证唯一
    // 为什么不判断机器ID和数据中心ID是否与上次生成一致？
    // 因为一般来说，机器ID和数据中心ID在程序启动前都是分配好的，每个机器唯一，所以此处不判断
    if (this.lastTimestamp === timestamp) {
        this.sequence = (this.sequence + 1) & this.sequenceMask;
        // 如果序列号增加到了最大值，则等待到下一毫秒在生成ID
        if (this.sequence === 0) {
            timestamp = this.tilNextMillis(this.lastTimestamp);
        }
    } else {
        this.sequence = 0;
    }
    this.lastTimestamp = timestamp;
    // 数据组合(相对时间戳|数据中心ID|机器ID|序列)，生成ID
    let shiftNum = (this.dataCenterId << this.dataCenterIdShift) |
        (this.workerId << this.workerIdShift) |
        this.sequence;
    let nfirst = new bigInt(String(timestamp - this.twepoch), 10);
    nfirst = nfirst.shiftLeft(this.timestampLeftShift);
    return nfirst.or(new bigInt(String(shiftNum), 10)).toString(10);
};
this.Snowflake = Snowflake;
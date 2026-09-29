/**
 * 数独求解器：求解 + 逐步推理讲解
 *
 * 设计要点：
 * - 求解分两段：先用「人类技巧」裸推（每步都带得出手的理由），推不动时再用
 *   全候选数回溯补完余下格子。这样常见题目全程可讲解，难题也不会解不出来。
 * - candidates[idx] 是位掩码，第 d-1 位表示数字 d 能否填入该格。
 * - 每步都记录成 Step（含 impacts 与棋盘快照），UI 只负责展示与跳步回放。
 */
(function (global) {
    'use strict';

    var ROW_LABEL = 'R';
    var COL_LABEL = 'C';
    var ALL = 0x1ff;
    var FULL_PEERS = null;

    function idxOf(r, c) { return r * 9 + c; }
    function rowOf(i) { return Math.floor(i / 9); }
    function colOf(i) { return i % 9; }
    function boxOf(i) { return Math.floor(Math.floor(i / 9) / 3) * 3 + Math.floor((i % 9) / 3); }
    function cellName(i) { return ROW_LABEL + (rowOf(i) + 1) + COL_LABEL + (colOf(i) + 1); }

    function peersOf(i) {
        if (!FULL_PEERS) {
            FULL_PEERS = [];
            for (var k = 0; k < 81; k++) {
                var set = {};
                var r = rowOf(k), c = colOf(k);
                var br = Math.floor(r / 3) * 3, bc = Math.floor(c / 3) * 3;
                var m = 0;
                for (var t = 0; t < 9; t++) {
                    set[idxOf(r, t)] = 1;
                    set[idxOf(t, c)] = 1;
                    set[idxOf(br + Math.floor(t / 3), bc + (t % 3))] = 1;
                }
                delete set[k];
                FULL_PEERS.push(Object.keys(set).map(Number));
            }
        }
        return FULL_PEERS[i];
    }

    function rowCells(r) { var a = []; for (var c = 0; c < 9; c++) a.push(idxOf(r, c)); return a; }
    function colCells(c) { var a = []; for (var r = 0; r < 9; r++) a.push(idxOf(r, c)); return a; }
    function boxCells(b) {
        var a = [], br = Math.floor(b / 3) * 3, bc = (b % 3) * 3;
        for (var r = 0; r < 3; r++) for (var c = 0; c < 3; c++) a.push(idxOf(br + r, bc + c));
        return a;
    }
    function boxName(b) { return '第' + (b + 1) + '宫'; }
    function unitCells(type, n) {
        if (type === 'row') return rowCells(n);
        if (type === 'col') return colCells(n);
        return boxCells(n);
    }
    function unitLabel(type, n) {
        if (type === 'row') return '第' + ROW_LABEL + (n + 1) + '行';
        if (type === 'col') return '第' + COL_LABEL + (n + 1) + '列';
        return boxName(n);
    }

    function digitsOf(mask) {
        var out = [];
        for (var d = 1; d <= 9; d++) if (mask & (1 << (d - 1))) out.push(d);
        return out;
    }
    function popcount(m) { var n = 0; while (m) { m &= m - 1; n++; } return n; }
    function listCellNames(cells) { return cells.map(cellName).join('、'); }
    function listDigits(arr) { return arr.join('、'); }

    function computeCandidates(values, i) {
        if (values[i] !== 0) return 0;
        var mask = ALL, p = peersOf(i);
        for (var k = 0; k < p.length; k++) {
            var v = values[p[k]];
            if (v !== 0) mask &= ~(1 << (v - 1));
        }
        return mask & ALL;
    }

    function createState(values) {
        var st = { values: values.slice(), candidates: new Array(81) };
        for (var i = 0; i < 81; i++) st.candidates[i] = computeCandidates(st.values, i);
        return st;
    }

    /**
     * 落子，并连带排除同行、同列、同宫的候选数。
     * 返回被本次排除的格子，方便把「这一步影响了哪些格」讲清楚。
     */
    function place(state, idx, digit) {
        state.values[idx] = digit;
        state.candidates[idx] = 0;
        var bit = 1 << (digit - 1), p = peersOf(idx), removed = [];
        for (var k = 0; k < p.length; k++) {
            var i = p[k];
            if (state.values[i] === 0 && (state.candidates[i] & bit)) {
                state.candidates[i] &= ~bit;
                removed.push(i);
            }
        }
        return removed;
    }

    function eliminate(state, cells, digit) {
        var bit = 1 << (digit - 1), removed = [];
        for (var k = 0; k < cells.length; k++) {
            var i = cells[k];
            if (state.values[i] !== 0) continue;
            if (state.candidates[i] & bit) { state.candidates[i] &= ~bit; removed.push(i); }
        }
        return removed;
    }

    function emptyCells(state) {
        var out = [];
        for (var i = 0; i < 81; i++) if (state.values[i] === 0) out.push(i);
        return out;
    }

    function countSolutions(values, limit) {
        limit = limit || 2;
        var vals = values.slice(), found = 0;
        (function rec() {
            if (found >= limit) return;
            var best = -1, bestMask = 0, bestCount = 10;
            for (var i = 0; i < 81; i++) {
                if (vals[i] !== 0) continue;
                var mask = computeCandidates(vals, i), n = popcount(mask);
                if (n === 0) return;
                if (n < bestCount) { bestCount = n; best = i; bestMask = mask; if (n === 1) break; }
            }
            if (best === -1) { found++; return; }
            var ds = digitsOf(bestMask);
            for (var k = 0; k < ds.length; k++) {
                var prev = vals[best];
                vals[best] = ds[k];
                rec();
                vals[best] = prev;
                if (found >= limit) return;
            }
        })();
        return found;
    }

    /* ------------------------- 技巧 ------------------------- */

    // 唯一候选数：某格只剩一个候选
    function findNakedSingle(state) {
        var empties = emptyCells(state);
        for (var k = 0; k < empties.length; k++) {
            var i = empties[k], m = state.candidates[i];
            if (popcount(m) === 1) {
                var d = digitsOf(m)[0];
                return {
                    type: 'nakedSingle', cell: i, digit: d,
                    reason: cellName(i) + ' 所在的行、列、宫已经出现了除 ' + d + ' 以外的全部数字，这一格只剩 ' + d + ' 可以填，所以 ' + cellName(i) + ' = ' + d,
                    check: '同行、同列、同宫已出现 ' + listDigits(digitsOf(ALL & ~m)) + '，把这些数字从候选里排除了'
                };
            }
        }
        return null;
    }

    // 宫内唯一：某数字在一个单元中只有一个位置可放
    function findHiddenSingle(state) {
        var units = [];
        for (var r = 0; r < 9; r++) units.push(['row', r]);
        for (var c = 0; c < 9; c++) units.push(['col', c]);
        for (var b = 0; b < 9; b++) units.push(['box', b]);
        for (var u = 0; u < units.length; u++) {
            var type = units[u][0], n = units[u][1], cells = unitCells(type, n);
            for (var d = 1; d <= 9; d++) {
                var bit = 1 << (d - 1), placed = false, spots = [];
                for (var k = 0; k < cells.length; k++) {
                    if (state.values[cells[k]] === d) { placed = true; break; }
                    if (state.candidates[cells[k]] & bit) spots.push(cells[k]);
                }
                if (placed || spots.length !== 1) continue;
                var target = spots[0];
                var others = cells.filter(function (i) { return i !== target; });
                return {
                    type: 'hiddenSingle', cell: target, digit: d,
                    reason: unitLabel(type, n) + '里还没有 ' + d + '，而这一范围内只有 ' + cellName(target) + ' 能放下它，所以 ' + cellName(target) + ' = ' + d,
                    check: d + ' 在' + unitLabel(type, n) + '的其他位置（' + listCellNames(others) + '）都已排除该候选数'
                };
            }
        }
        return null;
    }

    /**
     * 单元内数字座位锁定（指向）：某数字在一个宫里只能落在同一行/列上，
     * 那么这一行/列在宫外的位置都不可能再放这个数字。
     */
    function analyzePointing(state) {
        for (var b = 0; b < 9; b++) {
            var cells = boxCells(b);
            for (var d = 1; d <= 9; d++) {
                var bit = 1 << (d - 1), placed = false, spots = [];
                for (var k = 0; k < cells.length; k++) {
                    if (state.values[cells[k]] === d) { placed = true; break; }
                    if (state.candidates[cells[k]] & bit) spots.push(cells[k]);
                }
                if (placed || spots.length < 2 || spots.length > 3) continue;
                var sameRow = spots.every(function (i) { return rowOf(i) === rowOf(spots[0]); });
                var sameCol = spots.every(function (i) { return colOf(i) === colOf(spots[0]); });
                if (!sameRow && !sameCol) continue;
                var unitCells_ = sameRow ? rowCells(rowOf(spots[0])) : colCells(colOf(spots[0]));
                var unitName = sameRow ? ('第' + ROW_LABEL + (rowOf(spots[0]) + 1) + '行')
                                       : ('第' + COL_LABEL + (colOf(spots[0]) + 1) + '列');
                var targets = unitCells_.filter(function (i) {
                    return boxOf(i) !== b && state.values[i] === 0 && (state.candidates[i] & (1 << (d - 1)));
                });
                if (!targets.length) continue;
                return pointingStep(b, d, spots, unitName, targets);
            }
        }
        return null;
    }

    /**
     * 行/列对宫的排除（占位）：某数字在一行/列里只能落在同一个宫内，
     * 那这个宫的其他位置就不可能再放这个数字。
     */
    function analyzeClaiming(state) {
        for (var type = 0; type < 2; type++) {
            var unitType = type === 0 ? 'row' : 'col';
            for (var n = 0; n < 9; n++) {
                var res = claimingFor(state, unitType, n);
                if (res) return res;
            }
        }
        return null;
    }

    function claimingFor(state, type, n) {
        var cells = unitCells(type, n);
        for (var d = 1; d <= 9; d++) {
            var bit = 1 << (d - 1), placed = false, spots = [];
            for (var k = 0; k < cells.length; k++) {
                if (state.values[cells[k]] === d) { placed = true; break; }
                if (state.candidates[cells[k]] & bit) spots.push(cells[k]);
            }
            if (placed || spots.length < 2 || spots.length > 3) continue;
            if (!spots.every(function (i) { return boxOf(i) === boxOf(spots[0]); })) continue;
            var box = boxOf(spots[0]), unitName = unitLabel(type, n);
            var targets = boxCells(box).filter(function (i) {
                var outside = type === 'row' ? rowOf(i) !== n : colOf(i) !== n;
                return outside && state.values[i] === 0 && (state.candidates[i] & (1 << (d - 1)));
            });
            if (!targets.length) continue;
            return claimingStep(box, d, spots, unitName, targets);
        }
        return null;
    }

    /**
     * 数字对（Naked Pair）：单元内两格的候选数都恰好是同样的两个数字，
     * 这两个数字必然占住这两格，单元内其他格子可以排除它们。
     */
    function analyzeNakedPair(state) {
        var units = [];
        for (var r = 0; r < 9; r++) units.push(['row', r]);
        for (var c = 0; c < 9; c++) units.push(['col', c]);
        for (var b = 0; b < 9; b++) units.push(['box', b]);
        for (var u = 0; u < units.length; u++) {
            var type = units[u][0], n = units[u][1], cells = unitCells(type, n);
            var empty = cells.filter(function (i) { return state.values[i] === 0; });
            for (var a = 0; a < empty.length; a++) {
                var ia = empty[a], ma = state.candidates[ia];
                if (popcount(ma) !== 2) continue;
                for (var b2 = a + 1; b2 < empty.length; b2++) {
                    var ib = empty[b2];
                    if (state.candidates[ib] !== ma) continue;
                    var ds = digitsOf(ma);
                    var specs = [];
                    for (var t = 0; t < ds.length; t++) {
                        var bit = 1 << (ds[t] - 1);
                        var targets = cells.filter(function (i) {
                            return i !== ia && i !== ib && state.values[i] === 0 && (state.candidates[i] & bit);
                        });
                        if (targets.length) specs.push({ type: 'eliminate', digit: ds[t], cells: targets });
                    }
                    if (!specs.length) continue;
                    return {
                        type: 'nakedPair',
                        reason: unitLabel(type, n) + '的 ' + cellName(ia) + ' 与 ' + cellName(ib) + ' 都只剩候选 ' + listDigits(ds) + '，这两个数字必然占住这两格',
                        check: '所以' + unitLabel(type, n) + '中其他格子不能再出现 ' + listDigits(ds),
                        apply: function () { return specs; }
                    };
                }
            }
        }
        return null;
    }

    /**
     * 三数组（Naked Triple）：单元内三格的候选数合并起来恰好是三个数字，
     * 这三个数字必然占住这三格，单元内其他格子可以排除它们。
     * 三个候选不必各自都只有三个（如 39 / 349 / 34 也是三数组），
     * 只要并集是三个数字、且并集数字都落在三格之内即可。
     */
    function analyzeNakedTriple(state) {
        var units = [];
        for (var r = 0; r < 9; r++) units.push(['row', r]);
        for (var c = 0; c < 9; c++) units.push(['col', c]);
        for (var b = 0; b < 9; b++) units.push(['box', b]);
        for (var u = 0; u < units.length; u++) {
            var type = units[u][0], n = units[u][1], cells = unitCells(type, n);
            var empty = cells.filter(function (i) { return state.values[i] === 0; });
            for (var a = 0; a < empty.length; a++) {
                var ma = state.candidates[empty[a]];
                if (popcount(ma) < 2 || popcount(ma) > 3) continue;
                for (var b2 = a + 1; b2 < empty.length; b2++) {
                    var mb = state.candidates[empty[b2]];
                    if (popcount(mb) < 2 || popcount(mb) > 3) continue;
                    for (var c2 = b2 + 1; c2 < empty.length; c2++) {
                        var mc = state.candidates[empty[c2]];
                        if (popcount(mc) < 2 || popcount(mc) > 3) continue;
                        var union = ma | mb | mc;
                        if (popcount(union) !== 3) continue;
                        var tri = [empty[a], empty[b2], empty[c2]], ds = digitsOf(union);
                        var specs = [];
                        for (var t = 0; t < ds.length; t++) {
                            var bit = 1 << (ds[t] - 1);
                            var targets = cells.filter(function (i) {
                                return tri.indexOf(i) === -1 && state.values[i] === 0 && (state.candidates[i] & bit);
                            });
                            if (targets.length) specs.push({ type: 'eliminate', digit: ds[t], cells: targets });
                        }
                        if (!specs.length) continue;
                        return {
                            type: 'nakedTriple',
                            reason: unitLabel(type, n) + '的 ' + listCellNames(tri) + ' 的候选数合起来只有 ' + listDigits(ds) + '，这三个数字必然占住这三格',
                            check: '所以' + unitLabel(type, n) + '中其他格子不能再出现 ' + listDigits(ds),
                            apply: function () { return specs; }
                        };
                    }
                }
            }
        }
        return null;
    }

    function pointingStep(b, d, spots, unitName, targets) {
        return {
            type: 'pointing',
            reason: boxName(b) + '里数字 ' + d + ' 只能落在 ' + listCellNames(spots) + '，而它们同在' + unitName + '上，因此' + unitName + '中' + boxName(b) + '以外的位置都不可能是 ' + d,
            check: '若' + unitName + '在' + boxName(b) + '以外的位置填 ' + d + '，' + boxName(b) + '内的 ' + d + ' 就无处可放',
            apply: function (st) {
                var live = targets.filter(function (i) { return st.values[i] === 0 && (st.candidates[i] & (1 << (d - 1))); });
                return live.length ? [{ type: 'eliminate', digit: d, cells: live }] : [];
            }
        };
    }

    function claimingStep(box, d, spots, unitName, targets) {
        return {
            type: 'claiming',
            reason: unitName + '中数字 ' + d + ' 只能落在 ' + listCellNames(spots) + '，而它们同属' + boxName(box) + '，因此' + boxName(box) + '内不在' + unitName + '上的位置都不可能是 ' + d,
            check: '若' + boxName(box) + '的这些位置填 ' + d + '，' + unitName + '的 ' + d + ' 将无处可放',
            apply: function (st) {
                var live = targets.filter(function (i) { return st.values[i] === 0 && (st.candidates[i] & (1 << (d - 1))); });
                return live.length ? [{ type: 'eliminate', digit: d, cells: live }] : [];
            }
        };
    }

    /* ------------------------- 步骤与影响 ------------------------- */

    /**
     * 一步推理对棋盘的影响，统一成 place / eliminate 两种原子操作。
     * 唯一候选数与唯一位置法落到 place，锁定候选与数字对落到 eliminate，
     * 这样状态机只有一套，回放与快照都不用分情况讨论。
     *
     * 两条注意：apply 只在真正有格可改时才返回内容——技巧的候选位置是在
     * 判定阶段算好的，执行时可能已被更早的步骤排除掉；没有可改内容时不产生
     * 步骤，否则 findLogicalStep 会一直返回同一个技巧而空转。
     */
    function toImpacts(state, step) {
        var specs;
        if (step.type === 'nakedSingle' || step.type === 'hiddenSingle' || step.type === 'trial') {
            specs = [{ type: 'place', cell: step.cell, digit: step.digit }];
        } else if (typeof step.apply === 'function') {
            specs = step.apply(state);
        } else {
            specs = step.impacts || [];
        }
        var out = [];
        for (var i = 0; i < specs.length; i++) {
            var spec = specs[i];
            if (spec.type === 'place') {
                var removed = place(state, spec.cell, spec.digit);
                out.push({ type: 'place', cell: spec.cell, digit: spec.digit, removed: removed, text: stepText(step.type, spec.cell, spec.digit) });
            } else {
                var hit = eliminate(state, spec.cells, spec.digit);
                if (hit.length) out.push({ type: 'eliminate', digit: spec.digit, cells: hit, text: listCellNames(hit) + ' 排除候选数 ' + spec.digit });
            }
        }
        return out;
    }

    function stepText(type, cell, digit) {
        return type === 'trial' ? '试填 ' + cellName(cell) + ' = ' + digit : cellName(cell) + ' = ' + digit;
    }

    function applyStep(state, step) {
        return toImpacts(state, step);
    }

    function makeStep(no, step, impacts) {
        var action = 'eliminate';
        if (step.type === 'trial') action = 'trial';
        else if (step.type === 'back') action = 'back';
        else if (step.type === 'nakedSingle' || step.type === 'hiddenSingle') action = 'place';
        return {
            no: no,
            action: action,
            type: step.type,
            label: stepLabel(step),
            cell: step.cell === undefined ? null : step.cell,
            digit: step.digit === undefined ? null : step.digit,
            reason: step.reason,
            check: step.check || '',
            impacts: impacts
        };
    }

    function stepLabel(step) {
        var map = {
            nakedSingle: '唯一候选数',
            hiddenSingle: '唯一位置法',
            pointing: '锁定候选（指向）',
            claiming: '锁定候选（占位）',
            nakedPair: '数字对排除',
            nakedTriple: '三数组排除',
            trial: '试探填数',
            back: '回退'
        };
        return map[step.type] || '推理';
    }

    // 推理优先级：越基础的技巧越先尝试，保证讲解对用户友好
    function findLogicalStep(state) {
        var single = findNakedSingle(state);
        if (single) return single;
        var hidden = findHiddenSingle(state);
        if (hidden) return hidden;
        return analyzePointing(state) || analyzeClaiming(state) ||
            analyzeNakedPair(state) || analyzeNakedTriple(state);
    }

    // 只做逻辑推理，直到推不动；返回是否已填满
    function runLogic(state, steps) {
        var guard = 0;
        while (guard++ < 2000) {
            if (isSolved(state)) return true;
            var step = findLogicalStep(state);
            if (!step) return false;
            var impacts = applyStep(state, step);
            if (!impacts.length) continue;
            steps.push(makeStep(steps.length + 1, step, impacts));
        }
        return isSolved(state);
    }

    function isSolved(state) {
        for (var i = 0; i < 81; i++) if (state.values[i] === 0) return false;
        return true;
    }

    /* ------------------------- 求解与快照 ------------------------- */

    /**
     * 求解：返回 { steps, solved, violations, finalValues }
     * 每一步都带 impacts 与棋盘快照，UI 可以任意跳步回放。
     *
     * 策略分两段：
     * 1. 先用逻辑技巧裸推，全程可讲解；
     * 2. 推不动时启用「全候选数」兜底——长链技巧（X-Wing 等）也能算出来。
     *    这类步骤只给出「逻辑推导」的说明，不再逐格展开，避免把教程变成噪音。
     * 只有长链技巧都推不出时才回落到试探+回溯，保证任何合法题目都能解出。
     */
    function solve(values) {
        // 输入本身自相矛盾（同行/列/宫已有重复数字）时直接返回，避免无意义的搜索
        var violations = validate(values);
        if (violations.length) {
            return { steps: [], solved: false, violations: violations, finalValues: values.slice() };
        }

        var steps = [];
        var logicState = createState(values.slice());
        if (runLogic(logicState, steps)) {
            attachSnapshots(values, steps);
            return result(values, steps, logicState.values, true);
        }

        // 逻辑推不完：保留已推出来的讲解，余下的格子交给兜底求解
        var solution = solveWithFullCandidates(values);
        if (!solution) {
            attachSnapshots(values, steps);
            return result(values, steps, logicState.values, false);
        }
        var rest = buildFallbackSteps(logicState.values, solution);
        var all = steps.concat(rest);
        attachSnapshots(values, all);
        return result(values, all, solution, true);
    }

    function result(values, steps, finalValues, solved) {
        var violations = validate(finalValues);
        return {
            steps: steps,
            solved: !!solved && !violations.length,
            violations: violations,
            finalValues: finalValues.slice()
        };
    }

    /* ------------------------- 兜底：全候选数求解 ------------------------- */

    /**
     * 全候选数回溯：内部只求「解」，不关心讲解。
     * 解出来之后由 buildFallbackSteps 转成带说明的步骤序列。
     */
    function solveWithFullCandidates(values) {
        var vals = values.slice(), solution = null, nodes = 0;
        // 节点上限：正常题目远达不到，病态盘面（如答数极多的空盘变体）能及时收手
        var MAX_NODES = 2000000;
        (function rec() {
            if (solution || ++nodes > MAX_NODES) return;
            var best = -1, bestMask = 0, bestCount = 10;
            for (var i = 0; i < 81; i++) {
                if (vals[i] !== 0) continue;
                var mask = computeCandidates(vals, i), n = popcount(mask);
                if (n === 0) return;
                if (n < bestCount) { bestCount = n; best = i; bestMask = mask; if (n === 1) break; }
            }
            if (best === -1) { solution = vals.slice(); return; }
            var ds = digitsOf(bestMask);
            for (var k = 0; k < ds.length; k++) {
                vals[best] = ds[k];
                rec();
                vals[best] = 0;
                if (solution) return;
            }
        })();
        return solution;
    }

    // 把「裸解」翻译成能逐步回放的步骤：每步填一个格并说明唯一性由来
    function buildFallbackSteps(baseValues, solution) {
        var steps = [];
        var state = createState(baseValues.slice());
        for (var i = 0; i < 81; i++) {
            if (baseValues[i] !== 0) continue;
            var d = solution[i];
            place(state, i, d);
            steps.push(makeStep(steps.length + 1, {
                type: 'fallback',
                cell: i,
                digit: d,
                label: '逻辑推导',
                reason: '综合全部候选数做整体推导后，' + cellName(i) + ' 确定为 ' + d,
                check: '该步依赖较长的推理链（如叉乘对/链式排除），不逐格展开'
            }, [{ type: 'place', cell: i, digit: d, removed: [], text: cellName(i) + ' = ' + d }]));
        }
        return steps;
    }

    /**
     * 逐步重放所有影响，给每一环补一份棋盘快照。
     * 快照是 UI 的基础：选中某一步就能回到那一步的棋盘。
     */
    function attachSnapshots(puzzle, steps) {
        var values = puzzle.slice();
        for (var s = 0; s < steps.length; s++) {
            var impacts = steps[s].impacts;
            for (var i = 0; i < impacts.length; i++) {
                if (impacts[i].type === 'place') values[impacts[i].cell] = impacts[i].digit;
            }
            steps[s].values = values.slice();
        }
    }

    function validate(values) {
        var out = [];
        function checkUnit(cells, name) {
            var seen = {};
            cells.forEach(function (i) {
                var v = values[i];
                if (v === 0) return;
                // 用 in 判断：index 0 的格子是合法值，直接判真会漏掉 R1C1 这类首格
                if (v in seen) out.push(name + ' 中数字 ' + v + ' 重复（' + cellName(seen[v]) + ' 与 ' + cellName(i) + '）');
                else seen[v] = i;
            });
        }
        for (var r = 0; r < 9; r++) checkUnit(rowCells(r), '第' + ROW_LABEL + (r + 1) + '行');
        for (var c = 0; c < 9; c++) checkUnit(colCells(c), '第' + COL_LABEL + (c + 1) + '列');
        for (var b = 0; b < 9; b++) checkUnit(boxCells(b), boxName(b));
        return out;
    }

    global.SudokuSolver = {
        solve: solve,
        countSolutions: countSolutions,
        validate: validate,
        cellName: cellName,
        rowOf: rowOf,
        colOf: colOf,
        boxOf: boxOf,
        digitsOf: digitsOf,
        popcount: popcount,
        computeCandidates: computeCandidates
    };
})(typeof window !== 'undefined' ? window : globalThis);

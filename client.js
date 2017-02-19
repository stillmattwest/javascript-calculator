$('document').ready(function () {

    // global state

    var total = 0;
    var operand = 'add';
    var operating = true;
    var closedOut = false;
    var overflow = false;

    // button operations

    $('.num-btn').click(function () {
        if (overflow) {
            return;
        }
        if (closedOut) {
            return;
        }
        var num = $(this).attr('data');
        display(num);
        updateOps(num);
        operating = false;
    });

    $('.op-btn').click(function () {
        if (overflow) {
            return;
        }
        var newOperand = $(this).attr('data');
        var txt = $(this).attr('data-text');
        if (closedOut === true) {
            if(newOperand === 'equals'){
                return;
            }
            operand = newOperand;
            clearOps();
            updateOps(total);
            updateOps(txt);
            closedOut = false;
        } else if (newOperand === 'equals') {
            if(closedOut || operating){
                return;
            }
            calculate();
            updateOps(txt);
            updateOps(total);
            operating = true;
            closedOut = true;
        } else if (!operating) {
            operating = true;
            calculate();
            updateOps(txt);
            operand = newOperand;
        } else {
            operand = newOperand;
            var oldOps = $('.ops').html();
            var newOps = oldOps.slice(0, -1);
            var newOps = newOps + txt;
            $('.ops').html(newOps);
        }
    });

    $('#clear').click(function () {
        clearDisplay();
        clearOps();
        total = 0;
        operating = true;
        operand = 'add';
        closedOut = false;
        display(total);
    });

    $('#ce').click(function () {
        if (overflow) {
            return;
        }
        if (closedOut) {
            clearOps();
            updateOps(total);
            closedOut = false;
            return;
        }
        clearDisplay();
        display(total);
        operating = true;
        // remove last entry from ops
        var oldOps = $('.ops').html();
        var nums = (/([0-9])/);
        var lastChar = oldOps[oldOps.length - 1];
        cleared = false;
        while (!cleared) {
            oldOps = oldOps.slice(0, -1);
            lastChar = oldOps[oldOps.length - 1];
            if (!nums.test(lastChar)) {
                cleared = true;
                clearOps();
                updateOps(oldOps);
            }
        }

    });

    // display and admin operations

    function display(val) {
        var value = val;
        var nums = (/([0-9])/);
        if (nums.test(value)) {
            var value = truncate(val);
        }
        if (operating) {
            clearDisplay();
        }
        $('.digits').append(value);
        // test for too long a display
        var str = getDisNum().toString();
        if (str.length > 12) {
            // truncate display if too long
            $('.digits').html('OVERFLOW ERR');
            overflow = true;
            setTimeout(function () {
                clearDisplay();
                clearOps();
                reset();
                display(total);
            }, 2000);
        }
    }

    function updateOps(val) {
        var value = val;
        var nums = (/([0-9])/);
        if (nums.test(value[value.length - 1])) {
            var value = truncate(val);
        }
        $('.ops').append(value);
    }

    function clearDisplay() {
        $('.digits').empty();
    }

    function clearOps() {
        $('.ops').empty();
    }

    function getDisNum() {
        var numText = $('.digits').html();
        return parseFloat(numText);
    }

    function truncate(val) {
        var value = parseFloat(val).toFixed(6);
        var str = value.toString();
        value = parseFloat(str);
        return value;
    }

    function reset() {
        total = 0;
        operand = 'add';
        operating = true;
        closedOut = false;
        overflow = false;
    }

    // math operations

    function add(num) {
        total += num;
    }

    function subtract(num) {
        total -= num;
    }

    function multiply(num) {
        total *= num;
    }

    function divide(num) {
        total = total / num;
    }

    function calculate() {
        var num = getDisNum();
        eval(operand + '(' + num + ')');
        clearDisplay();
        display(total);
        
    }

}); // end document ready
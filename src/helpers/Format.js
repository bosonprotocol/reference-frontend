import {ethers} from "ethers";

export function slugify(str)
{
  str = str.replace(/^\s+|\s+$/g, '');

  // Make the string lowercase
  str = str.toLowerCase();

  // Remove accents, swap ñ for n, etc
  var from = "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆÍÌÎÏŇÑÓÖÒÔÕØŘŔŠŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇíìîïňñóöòôõøðřŕšťúůüùûýÿžþÞĐđßÆa·/_,:;";
  var to   = "AAAAAACCCDEEEEEEEEIIIINNOOOOOORRSTUUUUUYYZaaaaaacccdeeeeeeeeiiiinnooooooorrstuuuuuyyzbBDdBAa------";
  for (var i=0, l=from.length ; i<l ; i++) {
      str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  // Remove invalid chars
  str = str.replace(/[^a-z0-9 -]/g, '') 
  // Collapse whitespace and replace by -
  .replace(/\s+/g, '-') 
  // Collapse dashes
  .replace(/-+/g, '-'); 

  return str;
}

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export function formatDate(date, type) {
    let newFormat;
    if (!date) {
        return "NA";
    }

    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    if(type === 'string') {
        newFormat = [day, monthNames[parseInt(month - 1)], year].join('-')
    } else {
        newFormat = [year, month, day].join('-')
    }

    return newFormat
}

/**
 * Converts e-formatted numbers to decimal-formatted
 * string.
 * @param num The exponential formatted number
 * @returns {string}
 */
export function exponentToDecimal(num) {
    const data = String(num).split(/[eE]/);
    if (data.length === 1) {
        return data[0];
    }

    const sign = this < 0 ? '-' : '';
    const str = data[0].replace('.', '');
    let z = '';
    let mag = Number(data[1]) + 1;

    if (mag < 0) {
        z = sign + '0.';
        while (mag++) {
            z += '0';
        }
        return z + str.replace(/^\/-/,'');
    }

    mag -= str.length;
    while (mag--) {
        z += '0';
    }
    return str + z;
}

/**
 * Calculates total (price * quantity) in ETH.
 * Required due to last digit shift in ethers multiplication.
 * @param value The value to be multiplied by the quantity
 * @param quantity The quantity
 * @returns {string} Total in ETH - formatted
 */
export function totalDepositCalcEth(value, quantity) {
    console.log(value)
    console.log(quantity)
    if (!value || !quantity) {
        return "";
    }

    return ethers.utils.formatEther(value.mul(quantity));
}

/**
 * Input string will be sanitised if not only
 * consisting of numbers and a single decimal
 * point.
 * @param str Input string
 * @returns {string} Formatted number as string
 */
export function formatStringAsNumber(str) {
    str = str.replace(/[^0-9.]/g, ''); // restrict to numbers & decimal points

    const decCount = str.split(".")
    if (decCount.length > 1) {
        str = [decCount[0], decCount[1]].join("."); // if 2 decimal points, remove 2nd point and succeeding values
    }

    return str;
}
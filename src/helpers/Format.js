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

const dayFormat = (day) => {
    let t = day
    if(day >= 4) {
        t += 'th'
    } else if(day === 1) {
        t += 'st'
    }
    else if(day === 2) {
        t += 'nd'
    }
    else if(day === 3) {
        t += 'rd'
    }

    return t;
}

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
        newFormat = [monthNames[parseInt(month)], dayFormat(day), year].join(' ')
    } else {
        newFormat = [year, month, day].join('-')
    }

    return newFormat
}
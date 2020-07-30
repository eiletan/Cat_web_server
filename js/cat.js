
// Compares equality between two cat objects, assuming that the cats at least have the same keys because they are both processed
// returns true if equal, returns false if not
function catsEquals (cat1,cat2) {
    let keys = Object.keys(cat1);
    for(let k of keys) {
        if (cat1[k] !== cat2[k]) {
            return false;
        }
    }
    return true;
}

// Compares two lists of cats, and returns a list of any that differ, assuming that the lists have been processed to objects
function compareCats(memcats, newcats) {
    let keys = Object.keys(newcats);
    let ret = [];
    for (let k of keys) {
        if (memcats[k] === undefined) {
            ret.push(newcats[k]);
            continue;
        }
        if (!catsEquals(newcats[k],memcats[k])) {
            ret.push(newcats[k]);
        }
    }
    return ret;
}

module.exports.catsEquals = catsEquals;
module.exports.compareCats = compareCats;
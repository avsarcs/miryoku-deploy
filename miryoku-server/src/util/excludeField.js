function excludeField(originalObject, fieldToExclude) {
    const { [fieldToExclude]: _, ...resultObject } = originalObject;
    return resultObject;
}

module.exports = excludeField
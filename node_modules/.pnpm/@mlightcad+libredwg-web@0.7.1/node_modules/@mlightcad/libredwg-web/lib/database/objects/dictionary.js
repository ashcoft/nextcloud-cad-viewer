/**
 * Duplicate record cloning flag (determines how to merge duplicate entries)
 * - 0: Not applicable
 * - 1: Keep existing
 * - 2: Use clone
 * - 3: <xref>$0$<name>
 * - 4: $0$<name>
 * - 5: Unmangle name
 */
export var DwgDictionaryCloningFlags;
(function (DwgDictionaryCloningFlags) {
    DwgDictionaryCloningFlags[DwgDictionaryCloningFlags["NotApplicable"] = 0] = "NotApplicable";
    DwgDictionaryCloningFlags[DwgDictionaryCloningFlags["KeepExisting"] = 1] = "KeepExisting";
    DwgDictionaryCloningFlags[DwgDictionaryCloningFlags["UseClone"] = 2] = "UseClone";
    DwgDictionaryCloningFlags[DwgDictionaryCloningFlags["XrefName"] = 3] = "XrefName";
    DwgDictionaryCloningFlags[DwgDictionaryCloningFlags["Name"] = 4] = "Name";
    DwgDictionaryCloningFlags[DwgDictionaryCloningFlags["UnmangleName"] = 5] = "UnmangleName";
})(DwgDictionaryCloningFlags || (DwgDictionaryCloningFlags = {}));
//# sourceMappingURL=dictionary.js.map
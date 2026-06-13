export var DwgCodePage;
(function (DwgCodePage) {
    DwgCodePage[DwgCodePage["CP_UTF8"] = 0] = "CP_UTF8";
    DwgCodePage[DwgCodePage["CP_US_ASCII"] = 1] = "CP_US_ASCII";
    DwgCodePage[DwgCodePage["CP_ISO_8859_1"] = 2] = "CP_ISO_8859_1";
    DwgCodePage[DwgCodePage["CP_ISO_8859_2"] = 3] = "CP_ISO_8859_2";
    DwgCodePage[DwgCodePage["CP_ISO_8859_3"] = 4] = "CP_ISO_8859_3";
    DwgCodePage[DwgCodePage["CP_ISO_8859_4"] = 5] = "CP_ISO_8859_4";
    DwgCodePage[DwgCodePage["CP_ISO_8859_5"] = 6] = "CP_ISO_8859_5";
    DwgCodePage[DwgCodePage["CP_ISO_8859_6"] = 7] = "CP_ISO_8859_6";
    DwgCodePage[DwgCodePage["CP_ISO_8859_7"] = 8] = "CP_ISO_8859_7";
    DwgCodePage[DwgCodePage["CP_ISO_8859_8"] = 9] = "CP_ISO_8859_8";
    DwgCodePage[DwgCodePage["CP_ISO_8859_9"] = 10] = "CP_ISO_8859_9";
    DwgCodePage[DwgCodePage["CP_CP437"] = 11] = "CP_CP437";
    DwgCodePage[DwgCodePage["CP_CP850"] = 12] = "CP_CP850";
    DwgCodePage[DwgCodePage["CP_CP852"] = 13] = "CP_CP852";
    DwgCodePage[DwgCodePage["CP_CP855"] = 14] = "CP_CP855";
    DwgCodePage[DwgCodePage["CP_CP857"] = 15] = "CP_CP857";
    DwgCodePage[DwgCodePage["CP_CP860"] = 16] = "CP_CP860";
    DwgCodePage[DwgCodePage["CP_CP861"] = 17] = "CP_CP861";
    DwgCodePage[DwgCodePage["CP_CP863"] = 18] = "CP_CP863";
    DwgCodePage[DwgCodePage["CP_CP864"] = 19] = "CP_CP864";
    DwgCodePage[DwgCodePage["CP_CP865"] = 20] = "CP_CP865";
    DwgCodePage[DwgCodePage["CP_CP869"] = 21] = "CP_CP869";
    DwgCodePage[DwgCodePage["CP_CP932"] = 22] = "CP_CP932";
    DwgCodePage[DwgCodePage["CP_MACINTOSH"] = 23] = "CP_MACINTOSH";
    DwgCodePage[DwgCodePage["CP_BIG5"] = 24] = "CP_BIG5";
    DwgCodePage[DwgCodePage["CP_CP949"] = 25] = "CP_CP949";
    DwgCodePage[DwgCodePage["CP_JOHAB"] = 26] = "CP_JOHAB";
    DwgCodePage[DwgCodePage["CP_CP866"] = 27] = "CP_CP866";
    DwgCodePage[DwgCodePage["CP_ANSI_1250"] = 28] = "CP_ANSI_1250";
    DwgCodePage[DwgCodePage["CP_ANSI_1251"] = 29] = "CP_ANSI_1251";
    DwgCodePage[DwgCodePage["CP_ANSI_1252"] = 30] = "CP_ANSI_1252";
    DwgCodePage[DwgCodePage["CP_GB2312"] = 31] = "CP_GB2312";
    DwgCodePage[DwgCodePage["CP_ANSI_1253"] = 32] = "CP_ANSI_1253";
    DwgCodePage[DwgCodePage["CP_ANSI_1254"] = 33] = "CP_ANSI_1254";
    DwgCodePage[DwgCodePage["CP_ANSI_1255"] = 34] = "CP_ANSI_1255";
    DwgCodePage[DwgCodePage["CP_ANSI_1256"] = 35] = "CP_ANSI_1256";
    DwgCodePage[DwgCodePage["CP_ANSI_1257"] = 36] = "CP_ANSI_1257";
    DwgCodePage[DwgCodePage["CP_ANSI_874"] = 37] = "CP_ANSI_874";
    DwgCodePage[DwgCodePage["CP_ANSI_932"] = 38] = "CP_ANSI_932";
    DwgCodePage[DwgCodePage["CP_ANSI_936"] = 39] = "CP_ANSI_936";
    DwgCodePage[DwgCodePage["CP_ANSI_949"] = 40] = "CP_ANSI_949";
    DwgCodePage[DwgCodePage["CP_ANSI_950"] = 41] = "CP_ANSI_950";
    DwgCodePage[DwgCodePage["CP_ANSI_1361"] = 42] = "CP_ANSI_1361";
    DwgCodePage[DwgCodePage["CP_UTF16"] = 43] = "CP_UTF16";
    DwgCodePage[DwgCodePage["CP_ANSI_1258"] = 44] = "CP_ANSI_1258";
    DwgCodePage[DwgCodePage["CP_UNDEFINED"] = 255] = "CP_UNDEFINED"; // mostly R11
})(DwgCodePage || (DwgCodePage = {}));
const encodings = [
    'utf-8', // 0
    'utf-8', // US ASCII
    'iso-8859-1',
    'iso-8859-2',
    'iso-8859-3',
    'iso-8859-4',
    'iso-8859-5',
    'iso-8859-6',
    'iso-8859-7',
    'iso-8859-8',
    'iso-8859-9', // 10
    'utf-8', // DOS English
    'utf-8', // 12 DOS Latin-1
    'utf-8', // DOS Central European
    'utf-8', // DOS Cyrillic
    'utf-8', // DOS Turkish
    'utf-8', // DOS Portoguese
    'utf-8', // DOS Icelandic
    'utf-8', // DOS Hebrew
    'utf-8', // DOS Arabic (IBM)
    'utf-8', // DOS Nordic
    'utf-8', // DOS Greek
    'shift-jis', // DOS Japanese (shiftjis)
    'macintosh', // 23
    'big5',
    'utf-8', // Korean (Wansung + Johab)
    'utf-8', // Johab?
    'ibm866', // Russian
    'windows-1250', // Central + Eastern European
    'windows-1251', // Cyrillic
    'windows-1252', // Western European
    'gbk', // EUC-CN Chinese
    'windows-1253', // Greek
    'windows-1254', // Turkish
    'windows-1255', // Hebrew
    'windows-1256', // Arabic
    'windows-1257', // Baltic
    'windows-874', // Thai
    'shift-jis', // 38 Japanese (extended shiftjis, windows-31j)
    'gbk', // 39 Simplified Chinese
    'euc-kr', // 40 Korean Wansung
    'big5', // 41 Trad Chinese
    'utf-8', // 42 Korean Wansung
    'utf-16le',
    'windows-1258' // Vietnamese
];
export const dwgCodePageToEncoding = (codepage) => {
    return encodings[codepage];
};
//# sourceMappingURL=codepage.js.map
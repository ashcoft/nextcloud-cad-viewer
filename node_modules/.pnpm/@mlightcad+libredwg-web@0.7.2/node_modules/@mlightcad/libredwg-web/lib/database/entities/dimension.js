export var DwgDimensionType;
(function (DwgDimensionType) {
    DwgDimensionType[DwgDimensionType["Rotated"] = 0] = "Rotated";
    DwgDimensionType[DwgDimensionType["Aligned"] = 1] = "Aligned";
    DwgDimensionType[DwgDimensionType["Angular"] = 2] = "Angular";
    DwgDimensionType[DwgDimensionType["Diameter"] = 3] = "Diameter";
    DwgDimensionType[DwgDimensionType["Radius"] = 4] = "Radius";
    DwgDimensionType[DwgDimensionType["Angular3Point"] = 5] = "Angular3Point";
    DwgDimensionType[DwgDimensionType["Ordinate"] = 6] = "Ordinate";
    DwgDimensionType[DwgDimensionType["ReferenceIsExclusive"] = 32] = "ReferenceIsExclusive";
    DwgDimensionType[DwgDimensionType["IsOrdinateXTypeFlag"] = 64] = "IsOrdinateXTypeFlag";
    DwgDimensionType[DwgDimensionType["IsCustomTextPositionFlag"] = 128] = "IsCustomTextPositionFlag";
})(DwgDimensionType || (DwgDimensionType = {}));
export var DwgAttachmentPoint;
(function (DwgAttachmentPoint) {
    DwgAttachmentPoint[DwgAttachmentPoint["TopLeft"] = 1] = "TopLeft";
    DwgAttachmentPoint[DwgAttachmentPoint["TopCenter"] = 2] = "TopCenter";
    DwgAttachmentPoint[DwgAttachmentPoint["TopRight"] = 3] = "TopRight";
    DwgAttachmentPoint[DwgAttachmentPoint["MiddleLeft"] = 4] = "MiddleLeft";
    DwgAttachmentPoint[DwgAttachmentPoint["MiddleCenter"] = 5] = "MiddleCenter";
    DwgAttachmentPoint[DwgAttachmentPoint["MiddleRight"] = 6] = "MiddleRight";
    DwgAttachmentPoint[DwgAttachmentPoint["BottomLeft"] = 7] = "BottomLeft";
    DwgAttachmentPoint[DwgAttachmentPoint["BottomCenter"] = 8] = "BottomCenter";
    DwgAttachmentPoint[DwgAttachmentPoint["BottomRight"] = 9] = "BottomRight";
})(DwgAttachmentPoint || (DwgAttachmentPoint = {}));
export var DwgDimensionTextLineSpacing;
(function (DwgDimensionTextLineSpacing) {
    DwgDimensionTextLineSpacing[DwgDimensionTextLineSpacing["AtLeast"] = 1] = "AtLeast";
    DwgDimensionTextLineSpacing[DwgDimensionTextLineSpacing["Exact"] = 2] = "Exact";
})(DwgDimensionTextLineSpacing || (DwgDimensionTextLineSpacing = {}));
export var DwgDimensionTextVertical;
(function (DwgDimensionTextVertical) {
    DwgDimensionTextVertical[DwgDimensionTextVertical["Center"] = 0] = "Center";
    DwgDimensionTextVertical[DwgDimensionTextVertical["Above"] = 1] = "Above";
    DwgDimensionTextVertical[DwgDimensionTextVertical["Outside"] = 2] = "Outside";
    DwgDimensionTextVertical[DwgDimensionTextVertical["JIS"] = 3] = "JIS";
    DwgDimensionTextVertical[DwgDimensionTextVertical["Below"] = 4] = "Below";
})(DwgDimensionTextVertical || (DwgDimensionTextVertical = {}));
export var DwgDimensionZeroSuppression;
(function (DwgDimensionZeroSuppression) {
    DwgDimensionZeroSuppression[DwgDimensionZeroSuppression["Feet"] = 0] = "Feet";
    DwgDimensionZeroSuppression[DwgDimensionZeroSuppression["None"] = 1] = "None";
    DwgDimensionZeroSuppression[DwgDimensionZeroSuppression["Inch"] = 2] = "Inch";
    DwgDimensionZeroSuppression[DwgDimensionZeroSuppression["FeetAndInch"] = 3] = "FeetAndInch";
    DwgDimensionZeroSuppression[DwgDimensionZeroSuppression["Leading"] = 4] = "Leading";
    DwgDimensionZeroSuppression[DwgDimensionZeroSuppression["Trailing"] = 8] = "Trailing";
    DwgDimensionZeroSuppression[DwgDimensionZeroSuppression["LeadingAndTrailing"] = 12] = "LeadingAndTrailing";
})(DwgDimensionZeroSuppression || (DwgDimensionZeroSuppression = {}));
export var DwgDimensionZeroSuppressionAngular;
(function (DwgDimensionZeroSuppressionAngular) {
    DwgDimensionZeroSuppressionAngular[DwgDimensionZeroSuppressionAngular["None"] = 0] = "None";
    DwgDimensionZeroSuppressionAngular[DwgDimensionZeroSuppressionAngular["Leading"] = 1] = "Leading";
    DwgDimensionZeroSuppressionAngular[DwgDimensionZeroSuppressionAngular["Trailing"] = 2] = "Trailing";
    DwgDimensionZeroSuppressionAngular[DwgDimensionZeroSuppressionAngular["LeadingAndTrailing"] = 3] = "LeadingAndTrailing";
})(DwgDimensionZeroSuppressionAngular || (DwgDimensionZeroSuppressionAngular = {}));
export var DwgDimensionTextHorizontal;
(function (DwgDimensionTextHorizontal) {
    DwgDimensionTextHorizontal[DwgDimensionTextHorizontal["Center"] = 0] = "Center";
    DwgDimensionTextHorizontal[DwgDimensionTextHorizontal["Left"] = 1] = "Left";
    DwgDimensionTextHorizontal[DwgDimensionTextHorizontal["Right"] = 2] = "Right";
    DwgDimensionTextHorizontal[DwgDimensionTextHorizontal["OverFirst"] = 3] = "OverFirst";
    DwgDimensionTextHorizontal[DwgDimensionTextHorizontal["OverSecond"] = 4] = "OverSecond";
})(DwgDimensionTextHorizontal || (DwgDimensionTextHorizontal = {}));
export var DwgDimensionToleranceTextVertical;
(function (DwgDimensionToleranceTextVertical) {
    DwgDimensionToleranceTextVertical[DwgDimensionToleranceTextVertical["Bottom"] = 0] = "Bottom";
    DwgDimensionToleranceTextVertical[DwgDimensionToleranceTextVertical["Center"] = 1] = "Center";
    DwgDimensionToleranceTextVertical[DwgDimensionToleranceTextVertical["Top"] = 2] = "Top";
})(DwgDimensionToleranceTextVertical || (DwgDimensionToleranceTextVertical = {}));
//# sourceMappingURL=dimension.js.map
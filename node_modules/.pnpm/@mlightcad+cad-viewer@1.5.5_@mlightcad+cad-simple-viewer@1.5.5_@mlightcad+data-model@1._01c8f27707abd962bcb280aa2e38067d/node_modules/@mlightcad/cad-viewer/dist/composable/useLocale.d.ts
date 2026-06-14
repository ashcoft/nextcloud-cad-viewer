import { AcApLocale } from '@mlightcad/cad-simple-viewer';
import { LocaleProp } from '../locale';
export declare const LOCALE_OPTIONS: ({
    locale: "en";
    label: string;
} | {
    locale: "zh";
    label: string;
})[];
export declare const isSupportedLocale: (value: string) => value is AcApLocale;
export declare function useLocale(propLocale?: LocaleProp): {
    currentLocale: import('vue').Ref<AcApLocale, AcApLocale>;
    effectiveLocale: import('vue').ComputedRef<LocaleProp>;
    elementPlusLocale: import('vue').ComputedRef<{
        name: string;
        el: {
            breadcrumb: {
                label: string;
            };
            colorpicker: {
                confirm: string;
                clear: string;
                defaultLabel: string;
                description: string;
                alphaLabel: string;
                alphaDescription: string;
                hueLabel: string;
                hueDescription: string;
                svLabel: string;
                svDescription: string;
                predefineDescription: string;
            };
            datepicker: {
                now: string;
                today: string;
                cancel: string;
                clear: string;
                confirm: string;
                dateTablePrompt: string;
                monthTablePrompt: string;
                yearTablePrompt: string;
                selectedDate: string;
                selectDate: string;
                selectTime: string;
                startDate: string;
                startTime: string;
                endDate: string;
                endTime: string;
                prevYear: string;
                nextYear: string;
                prevMonth: string;
                nextMonth: string;
                year: string;
                month1: string;
                month2: string;
                month3: string;
                month4: string;
                month5: string;
                month6: string;
                month7: string;
                month8: string;
                month9: string;
                month10: string;
                month11: string;
                month12: string;
                weeks: {
                    sun: string;
                    mon: string;
                    tue: string;
                    wed: string;
                    thu: string;
                    fri: string;
                    sat: string;
                };
                weeksFull: {
                    sun: string;
                    mon: string;
                    tue: string;
                    wed: string;
                    thu: string;
                    fri: string;
                    sat: string;
                };
                months: {
                    jan: string;
                    feb: string;
                    mar: string;
                    apr: string;
                    may: string;
                    jun: string;
                    jul: string;
                    aug: string;
                    sep: string;
                    oct: string;
                    nov: string;
                    dec: string;
                };
            };
            inputNumber: {
                decrease: string;
                increase: string;
            };
            select: {
                loading: string;
                noMatch: string;
                noData: string;
                placeholder: string;
            };
            mention: {
                loading: string;
            };
            dropdown: {
                toggleDropdown: string;
            };
            cascader: {
                noMatch: string;
                loading: string;
                placeholder: string;
                noData: string;
            };
            pagination: {
                goto: string;
                pagesize: string;
                total: string;
                pageClassifier: string;
                page: string;
                prev: string;
                next: string;
                currentPage: string;
                prevPages: string;
                nextPages: string;
                deprecationWarning: string;
            };
            dialog: {
                close: string;
            };
            drawer: {
                close: string;
            };
            messagebox: {
                title: string;
                confirm: string;
                cancel: string;
                error: string;
                close: string;
            };
            upload: {
                deleteTip: string;
                delete: string;
                preview: string;
                continue: string;
            };
            slider: {
                defaultLabel: string;
                defaultRangeStartLabel: string;
                defaultRangeEndLabel: string;
            };
            table: {
                emptyText: string;
                confirmFilter: string;
                resetFilter: string;
                clearFilter: string;
                sumText: string;
                selectAllLabel: string;
                selectRowLabel: string;
                expandRowLabel: string;
                collapseRowLabel: string;
                sortLabel: string;
                filterLabel: string;
            };
            tag: {
                close: string;
            };
            tour: {
                next: string;
                previous: string;
                finish: string;
                close: string;
            };
            tree: {
                emptyText: string;
            };
            transfer: {
                noMatch: string;
                noData: string;
                titles: string[];
                filterPlaceholder: string;
                noCheckedFormat: string;
                hasCheckedFormat: string;
            };
            image: {
                error: string;
            };
            pageHeader: {
                title: string;
            };
            popconfirm: {
                confirmButtonText: string;
                cancelButtonText: string;
            };
            carousel: {
                leftArrow: string;
                rightArrow: string;
                indicator: string;
            };
        };
    }>;
    setLocale: (newLocale: AcApLocale) => void;
    clearStoragePreference: () => void;
    isControlled: import('vue').ComputedRef<boolean>;
};
//# sourceMappingURL=useLocale.d.ts.map
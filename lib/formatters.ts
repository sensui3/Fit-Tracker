/**
 * Utilitários para formatação e máscaras de campos
 */

/**
 * Aplica máscara de data (DD/MM/YYYY) em uma string
 */
export const datePickerMask = (value: string): string => {
    // Remove tudo que não for dígito
    const digits = value.replace(/\D/g, '');

    // Limita a 8 dígitos
    const limitedDigits = digits.slice(0, 8);

    // Aplica a máscara
    if (limitedDigits.length <= 2) {
        return limitedDigits;
    }
    if (limitedDigits.length <= 4) {
        return `${limitedDigits.slice(0, 2)}/${limitedDigits.slice(2)}`;
    }
    return `${limitedDigits.slice(0, 2)}/${limitedDigits.slice(2, 4)}/${limitedDigits.slice(4)}`;
};

/**
 * Converte data de DD/MM/YYYY para YYYY-MM-DD
 */
export const dateToIso = (dateStr: string): string | null => {
    if (!dateStr || dateStr.length < 10) return null;
    const [day, month, year] = dateStr.split('/');
    if (!day || !month || !year) return null;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

/**
 * Converte data de YYYY-MM-DD para DD/MM/YYYY
 */
export const isoToDate = (isoStr: string): string => {
    if (!isoStr) return '';
    try {
        // Normaliza a string para ajudar o Safari
        // Substitui espaço por T caso venha do Postgres como "YYYY-MM-DD HH:mm:ss"
        const normalizedStr = isoStr.includes(' ') ? isoStr.replace(' ', 'T') : isoStr;

        const date = new Date(normalizedStr);

        if (isNaN(date.getTime())) {
            // Fallback manual robusto para Safari/iOS
            const match = isoStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
            if (match) {
                return `${match[3]}/${match[2]}/${match[1]}`;
            }
            return '';
        }

        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    } catch {
        return '';
    }
};

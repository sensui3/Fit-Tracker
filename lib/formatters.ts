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
        const date = new Date(isoStr);
        if (isNaN(date.getTime())) {
            // Se falhar o parse direto (ex: string ISO parcial), tenta split
            const parts = isoStr.split('T')[0].split('-');
            if (parts.length === 3) {
                return `${parts[2].padStart(2, '0')}/${parts[1].padStart(2, '0')}/${parts[0]}`;
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

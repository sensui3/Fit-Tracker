
import { Exercise } from '../types';

const RAW_EXERCISES = [
    {
        id: "1",
        name: "Supino Reto (Barra)",
        muscle: "Peitoral",
        equipment: "Barra",
        difficulty: "Intermediário",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAJt9p9Ob7rrMqby1AVymzotJS0hWbVDbnj2mJeEojIe-89yedWuIFaBnLTtsYG6Yx-RO3kwD-i7k0L5LLzTwFmeVNxCtOsEGOXmSz8b4pYoPw7gkinsFD3qx3WpweFld-v3yApxzj6R56Kf1CwoHdfQ_7ZUYySy5jJbc_fwxUbwe7ucEgGZ4TMe7KVL4XPNW_nrEQYgvtdD9qQIkpnh3SJRE2kTEkueBO-mQuU5KVS0_qNrHvfHEg5bYPPY3nlDTdbeYHMKfApXG8",
        description: "Exercício composto fundamental para o desenvolvimento da massa muscular do peitoral.",
        instructions: [
            { title: "Posicionamento", text: "Deite-se no banco plano com os olhos diretamente abaixo da barra. Mantenha os pés firmes no chão e a coluna levemente arqueada." },
            { title: "Movimento", text: "Desça a barra de forma controlada até tocar o meio do peito. Empurre a barra de volta à posição inicial." }
        ]
    },
    {
        id: "2",
        name: "Supino Inclinado (Halteres)",
        muscle: "Peitoral",
        equipment: "Halteres",
        difficulty: "Intermediário",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBIV2N5qK6TRU5vfzegy7pLo7clecn_QLnF_wdzsheZzPxTjfRig95IXQmXU-LprvExwMB5t90SLIfkuWDbp7lhN-KgRgyoI648JF2_IPOHHxAAqj-EZWcze4W6Ik86JVpKjfp3YM3RLvH8Rcgcgm6ysfCVWh9Y1ij-cCmndtvnPrZZyn0Yur1i-ZtWgxdx2lUAbTnMPJ44ChBWpmkBwyRVa48pJccu0AqZu6riVxT0s_JTiZlndVeS6h74pvL3CI3HIIowoU_XQYw",
        description: "Foco na porção clavicular (superior) do peitoral.",
        instructions: []
    },
    {
        id: "3",
        name: "Crucifixo na Máquina",
        muscle: "Peitoral",
        equipment: "Máquina",
        difficulty: "Iniciante",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBIV2N5qK6TRU5vfzegy7pLo7clecn_QLnF_wdzsheZzPxTjfRig95IXQmXU-LprvExwMB5t90SLIfkuWDbp7lhN-KgRgyoI648JF2_IPOHHxAAqj-EZWcze4W6Ik86JVpKjfp3YM3RLvH8Rcgcgm6ysfCVWh9Y1ij-cCmndtvnPrZZyn0Yur1i-ZtWgxdx2lUAbTnMPJ44ChBWpmkBwyRVa48pJccu0AqZu6riVxT0s_JTiZlndVeS6h74pvL3CI3HIIowoU_XQYw",
        description: "Exercício isolador para peitoral com tensão constante.",
        instructions: []
    },
    {
        id: "4",
        name: "Agachamento Livre",
        muscle: "Pernas",
        equipment: "Barra",
        difficulty: "Avançado",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBbPX5oo2Sb7KSZkMlJVFnDxuzL0TQcmEjzDDPiJhkXDBHjWG1I1VLkTQkVIm1YIxwnYWqi4cinSNXdLeahmltSmzGBBzuKkwYZX3iEqNu6oAgGUMyZCGtjsR-ay0BY4ebLcz9te5pbeCO_9GA_dmhj-OxyHDI7SHaFctMy_owdCWHa47MtlGbD_TKi0Dj6UfUEnQzrQgYTyghhiPQ3kXzhcCpfyAAS26r8a2DUXrQPiu5RpARApxVrsecRq3S3ppyxk_xbJgatiaE",
        description: "O rei dos exercícios de perna. Trabalha quadríceps, glúteos e core.",
        instructions: [
            { title: "Posicionamento", text: "Fique em pé com a barra apoiada nos trapézios. Pés na largura dos ombros." },
            { title: "Execução", text: "Flexione os joelhos e o quadril como se fosse sentar em uma cadeira, mantendo a coluna reta." }
        ]
    },
    {
        id: "5",
        name: "Leg Press 45",
        muscle: "Pernas",
        equipment: "Máquina",
        difficulty: "Intermediário",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAYmC0rPib7YXizNo1HV2gleXNd_QBIIsW63ljv5wGV4DiJTsWtk0CKhIGL6qbylH6tPbCd_OGZcJH8O4KYzmF7fcIAOwFcRlsvgMgXyPG6K6fYQks-2GFXJ4Np0tTU77q7eKx9ie2fO7HO6x9f5gF7-8o6noeaG88dbPB5SJvmHxYicv-FDIWUNRD6FN1ayAn7MDm-iC2FQjM0Mfw40Ky9xpwPVZQep1PiBKHDDuyoEYf60N-kwoWGO9sREBUAqrtL4Jdj43K83Z0",
        description: "Exercício composto para pernas com foco em quadríceps e glúteos.",
        instructions: []
    },
    {
        id: "6",
        name: "Cadeira Extensora",
        muscle: "Pernas",
        equipment: "Máquina",
        difficulty: "Iniciante",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAYmC0rPib7YXizNo1HV2gleXNd_QBIIsW63ljv5wGV4DiJTsWtk0CKhIGL6qbylH6tPbCd_OGZcJH8O4KYzmF7fcIAOwFcRlsvgMgXyPG6K6fYQks-2GFXJ4Np0tTU77q7eKx9ie2fO7HO6x9f5gF7-8o6noeaG88dbPB5SJvmHxYicv-FDIWUNRD6FN1ayAn7MDm-iC2FQjM0Mfw40Ky9xpwPVZQep1PiBKHDDuyoEYf60N-kwoWGO9sREBUAqrtL4Jdj43K83Z0",
        description: "Isolador para quadríceps.",
        instructions: []
    },
    {
        id: "7",
        name: "Levantamento Terra",
        muscle: "Costas",
        equipment: "Barra",
        difficulty: "Avançado",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBKGhZmLWyqU8EfDxiNyV2jklL4Jn1r82jF3MXOpVsQzCPzK9LWkI_4x10kuFN5R0-UC8W0duuQ6zbM7h0oBDPjxxunHgzPBNqxdxxAjxQT4OZJshs_krHRXdAH2pk8JgSEWwgZRbQ0nHwh7Nla2b9JyipQZ65JijcsqjPfdZZ05aRIRfZ1XpoEI4WyaZk7KG66f37LMmiERzQSKVCl-FZ10G4-OCCPQS8O1DuZqqOZOGOfoy568zxK4CwNg5vKMRigxaWoDjvuWHw",
        description: "Exercício de força total que recruta toda a cadeia posterior do corpo.",
        instructions: [
            { title: "Preparação", text: "Pés na largura do quadril, barra sobre o meio dos pés. Segure a barra com os braços estendidos." },
            { title: "Levantamento", text: "Estenda os quadris e joelhos simultaneamente para levantar a barra, mantendo a coluna neutra." }
        ]
    },
    {
        id: "8",
        name: "Puxada Alta",
        muscle: "Costas",
        equipment: "Máquina",
        difficulty: "Iniciante",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBNkF30GhdYWoP3JSVhOIZNjkO4AF8b2UBb-uIwyMboCx09UR7K63FGb6anqGqko9F8gAfHOSGNxznFWUggqFTaQB9_97NZjOJn-rfZ16YvAREJxGnX8Kwp_ubP3rEfsO7lNJaWRfgHdfecN_W36lBcIUBzKAPQ3Ne8wbByoVlCwwSUvldpppIDK5zoW4MDUCWILEE8aHPJCXrcFktNwQzASkAnyQ4FA5b2bfxScPNX1rYPXJY02fqnODJaLHnneubSKE3guLRsxrE",
        description: "Foca na largura das costas (latíssimo do dorso).",
        instructions: []
    },
    {
        id: "9",
        name: "Remada Curvada",
        muscle: "Costas",
        equipment: "Barra",
        difficulty: "Avançado",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAYmC0rPib7YXizNo1HV2gleXNd_QBIIsW63ljv5wGV4DiJTsWtk0CKhIGL6qbylH6tPbCd_OGZcJH8O4KYzmF7fcIAOwFcRlsvgMgXyPG6K6fYQks-2GFXJ4Np0tTU77q7eKx9ie2fO7HO6x9f5gF7-8o6noeaG88dbPB5SJvmHxYicv-FDIWUNRD6FN1ayAn7MDm-iC2FQjM0Mfw40Ky9xpwPVZQep1PiBKHDDuyoEYf60N-kwoWGO9sREBUAqrtL4Jdj43K83Z0",
        description: "Excelente para espessura das costas.",
        instructions: []
    },
    {
        id: "10",
        name: "Rosca Direta",
        muscle: "Bíceps",
        equipment: "Barra",
        difficulty: "Iniciante",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBC3pJnQ-Img4u0bIBrYPePYWhQGOrxhrTQD4ZWZa3_b1RmNEaVXJxFA3WMh4i4bthUK-nmY_N7JyXJ1WSLRPzoJo6e8IoHepiHBD8sSGWrVl0hL5vokfXoJr6UPT8ZxSriVohAlUvPU3jovZoX-qS_KI4nAU3n6EyVXdHjFeWSBqt7E3hkTTZ_RsMjdFip83wbgHiSRdoR2ZrzqjsUY8E12cg0TxtIVRe1-WaM5OFxfeivuqA174_IMmeRtK6LzlUkQYo9Oj3qDfA",
        description: "Clássico para bíceps.",
        instructions: []
    },
    {
        id: "11",
        name: "Rosca Martelo",
        muscle: "Bíceps",
        equipment: "Halteres",
        difficulty: "Iniciante",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBIV2N5qK6TRU5vfzegy7pLo7clecn_QLnF_wdzsheZzPxTjfRig95IXQmXU-LprvExwMB5t90SLIfkuWDbp7lhN-KgRgyoI648JF2_IPOHHxAAqj-EZWcze4W6Ik86JVpKjfp3YM3RLvH8Rcgcgm6ysfCVWh9Y1ij-cCmndtvnPrZZyn0Yur1i-ZtWgxdx2lUAbTnMPJ44ChBWpmkBwyRVa48pJccu0AqZu6riVxT0s_JTiZlndVeS6h74pvL3CI3HIIowoU_XQYw",
        description: "Foco em braquial e antebraço.",
        instructions: []
    },
    {
        id: "12",
        name: "Tríceps Corda",
        muscle: "Tríceps",
        equipment: "Polia",
        difficulty: "Iniciante",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA-1Ow3_nu_nXWWP4eyH76m_kZMDErv21s2qcPgPGH1xzBuN4dC_eiIAC9oV8vfOIT1aBRIzUeINGNnQoG62tB6OpWnCIRilxygWMHGUm9zeTwJqCUyu5KriSaR5B5X4a5FAN8JKpBQFVBiOqNyOjnzPrKLF7slJgJk_qkfOlHpbIrHeqwtMPqRKhlN3oxgBj2cYEMsjJWxps664aOahKBpjKLTRdwo-b7bTGSHyeX-D8iByBv7Fk7L5kwNQhjG5-JIy55sce4FbQk",
        description: "Isola a cabeça lateral do tríceps.",
        instructions: []
    },
    {
        id: "13",
        name: "Tríceps Testa",
        muscle: "Tríceps",
        equipment: "Barra W",
        difficulty: "Intermediário",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBIV2N5qK6TRU5vfzegy7pLo7clecn_QLnF_wdzsheZzPxTjfRig95IXQmXU-LprvExwMB5t90SLIfkuWDbp7lhN-KgRgyoI648JF2_IPOHHxAAqj-EZWcze4W6Ik86JVpKjfp3YM3RLvH8Rcgcgm6ysfCVWh9Y1ij-cCmndtvnPrZZyn0Yur1i-ZtWgxdx2lUAbTnMPJ44ChBWpmkBwyRVa48pJccu0AqZu6riVxT0s_JTiZlndVeS6h74pvL3CI3HIIowoU_XQYw",
        description: "Excelente para a cabeça longa do tríceps.",
        instructions: []
    },
    {
        id: "14",
        name: "Desenvolvimento Militar",
        muscle: "Ombros",
        equipment: "Barra",
        difficulty: "Intermediário",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAtNi8rBwhlYdb3ovBee5utnUNc5ZU1pKTqYmdMV8s1b41zqVjrfAdqp6Mn5Ra3aSkxpHyP6Z-erbUzDQoHZLSkf_jOYhz9rjiSQmiFE0IzgYugdP7Mjn8sD8cUzrOLZuARc6jFBoG7RGsxxNEFfRQMaiS1RDASXSLWBln3B3q3J1R0Z0eEExaLMWFFfIpzp_kW_XtEC6vyc3n49fWl_wEnAQ9KWASzmrpQuCu97wqKtAr8hce77olypRJR2b1A8fCzdNVt3RCDNQY",
        description: "Construtor de massa para ombros.",
        instructions: []
    },
    {
        id: "15",
        name: "Elevação Lateral",
        muscle: "Ombros",
        equipment: "Halteres",
        difficulty: "Iniciante",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBIV2N5qK6TRU5vfzegy7pLo7clecn_QLnF_wdzsheZzPxTjfRig95IXQmXU-LprvExwMB5t90SLIfkuWDbp7lhN-KgRgyoI648JF2_IPOHHxAAqj-EZWcze4W6Ik86JVpKjfp3YM3RLvH8Rcgcgm6ysfCVWh9Y1ij-cCmndtvnPrZZyn0Yur1i-ZtWgxdx2lUAbTnMPJ44ChBWpmkBwyRVa48pJccu0AqZu6riVxT0s_JTiZlndVeS6h74pvL3CI3HIIowoU_XQYw",
        description: "Foco na porção lateral do deltoide para largura.",
        instructions: []
    },
    {
        id: "16",
        name: "Abdominal Supra",
        muscle: "Abdômen",
        equipment: "Peso do Corpo",
        difficulty: "Iniciante",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBIV2N5qK6TRU5vfzegy7pLo7clecn_QLnF_wdzsheZzPxTjfRig95IXQmXU-LprvExwMB5t90SLIfkuWDbp7lhN-KgRgyoI648JF2_IPOHHxAAqj-EZWcze4W6Ik86JVpKjfp3YM3RLvH8Rcgcgm6ysfCVWh9Y1ij-cCmndtvnPrZZyn0Yur1i-ZtWgxdx2lUAbTnMPJ44ChBWpmkBwyRVa48pJccu0AqZu6riVxT0s_JTiZlndVeS6h74pvL3CI3HIIowoU_XQYw",
        description: "Exercício fundamental para o reto abdominal.",
        instructions: []
    },
    {
        id: "17",
        name: "Prancha Isométrica",
        muscle: "Core",
        equipment: "Peso do Corpo",
        difficulty: "Iniciante",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBIV2N5qK6TRU5vfzegy7pLo7clecn_QLnF_wdzsheZzPxTjfRig95IXQmXU-LprvExwMB5t90SLIfkuWDbp7lhN-KgRgyoI648JF2_IPOHHxAAqj-EZWcze4W6Ik86JVpKjfp3YM3RLvH8Rcgcgm6ysfCVWh9Y1ij-cCmndtvnPrZZyn0Yur1i-ZtWgxdx2lUAbTnMPJ44ChBWpmkBwyRVa48pJccu0AqZu6riVxT0s_JTiZlndVeS6h74pvL3CI3HIIowoU_XQYw",
        description: "Estabilidade do core.",
        instructions: []
    },
    {
        id: "18",
        name: "Esteira - HIIT",
        muscle: "Cardio",
        equipment: "Máquina",
        difficulty: "Avançado",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCUTaMMoLGn0ssCZ4fx1aPaHxNhUrkr9mWmYiA5nzO7um1RGuEUK5OJvnAkmC6YvELPMpR6157RJGDQO83r6kTbQipwVYxhVv-nvpfmf_3gVmxliL-Il8Qg59-mzv9CRpSKmrRM5bXgVF0egShE6nPOml-kVAZ2B2dhbbyqMIeq1h6MdDQmb0wE_hIpQrBI8EkcJCNVUg18QwWjQTnExreEt91XPxbvBATLr4l1G-V04LU-DsAyAmtntYKMURkqc0SFp5FlQO13cGM",
        description: "Treino intervalado de alta intensidade.",
        instructions: [
            { title: "Aquecimento", text: "Caminhe por 5 minutos." },
            { title: "Tiro", text: "Corra na máxima velocidade por 30s." }
        ]
    }
];

export const EXERCISES: Exercise[] = RAW_EXERCISES.map(e => ({
    ...e,
    muscle_group: e.muscle,
    image_url: e.image,
    is_custom: false
} as unknown as Exercise));

export const MUSCLE_FILTERS = ['Peitoral', 'Costas', 'Pernas', 'Bíceps', 'Ombros', 'Cardio', 'Tríceps', 'Core', 'Abdômen'];
export const DIFFICULTY_FILTERS = ['Iniciante', 'Intermediário', 'Avançado'];
export const EQUIPMENT_FILTERS = ['Barra', 'Halteres', 'Máquina', 'Polia', 'Peso do Corpo', 'Barra W'];

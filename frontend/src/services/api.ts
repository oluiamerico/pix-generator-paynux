export interface PixRequest {
    public_key: string;
    secret_key: string;
    name: string;
    email: string;
    document: string;
    amount: number;
    version: string;
}

export interface PixResponse {
    qr_code_base64: string;
    qr_code_url?: string;
    pix_string: string;
    transaction_id?: string;
}

export const generatePix = async (data: PixRequest): Promise<PixResponse> => {

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    const response = await fetch(`${API_URL}/api/pix/generate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to generate PIX');
    }

    return response.json();
};

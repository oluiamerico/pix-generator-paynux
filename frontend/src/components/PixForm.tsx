"use client";

import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { generatePix, PixRequest, PixResponse } from "../services/api";

export default function PixForm() {
    const [formData, setFormData] = useState<PixRequest>({
        public_key: "",
        secret_key: "",
        name: "",
        email: "",
        document: "",
        amount: 10.0,
        version: "v1",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<PixResponse | null>(null);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            const newData = {
                ...prev,
                [name]: name === "amount" ? parseFloat(value) || 0 : value,
            };

            // Clear keys when version changes
            if (name === "version") {
                newData.public_key = "";
                newData.secret_key = "";
            }

            return newData;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await generatePix(formData);
            setResult(response);
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        if (result?.pix_string) {
            navigator.clipboard.writeText(result.pix_string);
            alert("PIX Code copied to clipboard!");
        }
    };

    return (
        <div className="max-w-4xl mx-auto w-full group">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden text-white transition-all duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* Form Section */}
                    <div className="p-8 md:p-12 relative lg:border-r border-white/10">
                        <h2 className="text-3xl font-bold mb-2 tracking-tight">
                            Gerador de Pix
                        </h2>
                        <p className="text-gray-400 mb-8 font-medium">
                            Crie pagamentos instantâneos via Pix.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        Public Key
                                    </label>
                                    <input
                                        type="text"
                                        name="public_key"
                                        required
                                        value={formData.public_key}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-\[#7939e8\]/50 transition-all placeholder-gray-600"
                                        placeholder="pk_T83c9..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        Secret Key
                                    </label>
                                    <input
                                        type="password"
                                        name="secret_key"
                                        required
                                        value={formData.secret_key}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-\[#7939e8\]/50 transition-all placeholder-gray-600"
                                        placeholder="sk_T98Od..."
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        Nome do Cliente
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-\[#7939e8\]/50 transition-all placeholder-gray-600"
                                        placeholder="Nome do Cliente"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        E-mail do Cliente
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-\[#7939e8\]/50 transition-all placeholder-gray-600"
                                        placeholder="E-mail do Cliente"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    Documento (CPF/CNPJ)
                                </label>
                                <input
                                    type="text"
                                    name="document"
                                    required
                                    value={formData.document}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#7939e8]/50 transition-all placeholder-gray-600"
                                    placeholder="000.000.000-00"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        Valor (R$)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="amount"
                                        required
                                        min="0.01"
                                        value={formData.amount}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#7939e8]/50 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        Versão do Gateway
                                    </label>
                                    <select
                                        name="version"
                                        value={formData.version}
                                        onChange={handleChange}
                                        className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#7939e8]/50 transition-all appearance-none"
                                    >
                                        <option value="v1">Paynux V1</option>
                                        <option value="v2">Paynux V2</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-4 bg-[#7939e8] hover:bg-[#9b66f2] text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#7939e8]/25"
                            >
                                {loading ? "Gerando..." : "Gerar PIX"}
                            </button>
                        </form>
                    </div>

                    {/* Result Section */}
                    <div className="p-8 md:p-12 bg-white/5 flex flex-col justify-center items-center text-center relative overflow-hidden">
                        {/* Decorative blob */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#7939e8]/20 rounded-full blur-3xl -z-10"></div>

                        {!result && !error && !loading && (
                            <div className="text-gray-500 animate-pulse flex flex-col items-center">
                                <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
                                <p>Aguardando envio...</p>
                            </div>
                        )}

                        {loading && (
                            <div className="text-[#9b66f2] flex flex-col items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-[#7939e8] mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <p className="font-semibold">Processando requisição...</p>
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl max-w-sm w-full">
                                <svg className="w-10 h-10 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <p className="font-medium">{error}</p>
                            </div>
                        )}

                        {result && !loading && (
                            <div className="w-full max-w-sm animate-fade-in-up">
                                <div className="bg-white p-4 rounded-2xl shadow-xl inline-block mb-6 relative group/qr">
                                    <QRCodeCanvas
                                        value={result.pix_string}
                                        size={200}
                                        level={"M"}
                                        includeMargin={true}
                                        className="w-48 h-48 md:w-56 md:h-56 object-contain"
                                    />
                                    <div className="absolute inset-0 bg-[#7939e8]/10 rounded-2xl opacity-0 group-hover/qr:opacity-100 transition-opacity pointer-events-none"></div>
                                </div>

                                <div className="space-y-3">
                                    <p className="text-sm font-semibold text-gray-300">
                                        PIX Copia e Cola
                                    </p>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            readOnly
                                            value={result.pix_string}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-xs md:text-sm text-gray-300 focus:outline-none"
                                        />
                                        <button
                                            onClick={handleCopy}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-lg transition-colors text-[#9b66f2]"
                                            title="Copy to clipboard"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {result.transaction_id && (
                                    <p className="text-xs text-gray-500 mt-6">
                                        ID da transação: <span className="font-mono">{result.transaction_id}</span>
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

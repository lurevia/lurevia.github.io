import type { FC } from "react";
import { Link, Navigate } from "react-router-dom";
import { ArrowLeft, Lock } from "lucide-react";

import { useCheckout } from "../hooks/useCheckout";
import { useCart } from "../hooks/useCart";
import { useAddresses } from "../hooks/useAddresses";
import { CheckoutSteps } from "../components/checkout/CheckoutSteps";
import { ShippingForm } from "../components/checkout/ShippingForm";
import { PaymentMethodSelector } from "../components/checkout/PaymentMethodSelector";
import { MobileMoneyForm } from "../components/checkout/MobileMoneyForm";
import { CardForm } from "../components/checkout/CardForm";
import { CashForm } from "../components/checkout/CashForm";
import { OrderSummary } from "../components/checkout/OrderSummary";
import { OrderSuccess } from "../components/checkout/OrderSuccess";
import { Button } from "../components/ui/Button";

export const CheckoutPage: FC = () => {
    const { cart } = useCart();
    const { addresses } = useAddresses();
    const {
        state,
        errors,
        subtotal,
        shippingCost,
        total,
        nextStep,
        prevStep,
        updateShipping,
        selectPaymentMethod,
        updateMobileMoney,
        updateCard,
        useSavedAddress,
        clearSavedShipping,
        validateShipping,
        validatePayment,
        submitOrder,
        lastOrder,
    } = useCheckout();

    // Panier vide → redirige vers la boutique
    if (cart.length === 0 && state.step !== 3) {
        return <Navigate to="/boutique" replace />;
    }

    // Étape 3 → succès
    if (state.step === 3 && lastOrder) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-10">
                <OrderSuccess order={lastOrder} />
            </div>
        );
    }

    const handleNext = () => {
        if (state.step === 1 && validateShipping()) {
            nextStep();
        } else if (state.step === 2 && validatePayment()) {
            submitOrder();
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-10 pb-28 md:pb-16">
            <Link
                to="/panier"
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-lurevia-dark transition-colors uppercase tracking-wider mb-6"
            >
                <ArrowLeft size={14} />
                Retour au panier
            </Link>

            <CheckoutSteps currentStep={state.step} />

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 items-start">
                <div className="bg-white border border-slate-100 rounded-2xl p-5 md:p-6 space-y-6">
                    {state.step === 1 && (
                        <ShippingForm
                            value={state.shipping}
                            errors={errors}
                            onChange={updateShipping}
                            onClearSaved={clearSavedShipping}
                            savedAddresses={addresses}
                            onUseSavedAddress={useSavedAddress}
                        />
                    )}

                    {state.step === 2 && (
                        <>
                            <PaymentMethodSelector
                                value={state.paymentMethod}
                                onChange={selectPaymentMethod}
                            />

                            {state.paymentMethod === "mobile-money" && (
                                <MobileMoneyForm
                                    value={state.mobileMoney}
                                    onChange={updateMobileMoney}
                                />
                            )}
                            {state.paymentMethod === "card" && (
                                <CardForm value={state.card} onChange={updateCard} />
                            )}
                            {state.paymentMethod === "cash" && <CashForm />}
                        </>
                    )}

                    <div className="flex gap-3 pt-2">
                        {state.step > 1 && (
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={prevStep}
                                className="flex-1 py-3! rounded-xl! font-bold text-sm"
                            >
                                Retour
                            </Button>
                        )}

                        <Button
                            type="button"
                            variant="primary"
                            onClick={handleNext}
                            icon={state.step === 2 ? Lock : undefined}
                            iconPosition="left"
                            className="flex-1 py-3! rounded-xl! font-black text-sm"
                        >
                            {state.step === 1
                                ? "Continuer vers le paiement"
                                : "Confirmer et payer"}
                        </Button>
                    </div>
                </div>

                {/* Colonne droite : récap */}
                <div className="lg:col-span-1">
                    <OrderSummary
                        subtotal={subtotal}
                        shippingCost={shippingCost}
                        total={total}
                    />
                </div>
            </div>
        </div>
    );
};
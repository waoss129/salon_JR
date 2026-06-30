ALTER TABLE public.bills ENABLE ROW LEVEL SECURITY;


CREATE POLICY "Customer can view their own bills" ON public.bills
FOR SELECT USING (
EXISTS (
SELECT 1 FROM public.appointments
WHERE appointments.id = bills.appointment_id
AND appointments.customer_id = auth.uid()
)
);
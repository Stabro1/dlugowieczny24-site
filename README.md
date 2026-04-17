# Dlugowieczny24.pl

Statyczna strona afiliacyjna (mobile-first), bez koszyka i bez checkoutu.

## Mapa strony
- `/` — strona główna (lej sprzedażowy)
- `/sen` — landing Sen
- `/energia` — landing Energia
- `/fundamenty` — landing Fundamenty
- `/faq` — FAQ
- `/kontakt` — Kontakt
- `/polityka-prywatnosci` — Polityka prywatności

## Struktura CTA
- Główne CTA: „Zobacz rekomendacje”
- Drugie CTA: „Zrób szybki quiz”
- Na kartach: „Przejdź do sklepu partnera”

## Miejsca na linki afiliacyjne
Wszystkie miejsca są oznaczone w HTML atrybutami `data-aff` i tymczasowym `href="#"`.
Podmień `href` na finalne linki partnerów.

## Struktura oferty
- Budżet
- Najlepszy wybór (wyróżnione)
- Premium (jako upgrade)

## Technicznie
- Czysty HTML/CSS/JS
- Brak zależności od frameworków
- Gotowe pod Vercel, ale łatwe do migracji na dowolny hosting statyczny

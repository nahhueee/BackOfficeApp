import { definePreset } from "@primeuix/themes";
import Aura from '@primeuix/themes/aura';

const CianPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '{cian.50}',
            100: '{cian.100}',
            200: '{cian.200}',
            300: '{cian.300}',
            400: '{cian.400}',
            500: '{cian.500}',
            600: '{cian.600}',
            700: '{cian.700}',
            800: '{cian.800}',
            900: '{cian.900}',
            950: '{cian.950}'
        }
    }
});

export { CianPreset };
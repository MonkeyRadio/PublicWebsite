<script setup lang="ts">
const props = defineProps<{
    text: string;
}>();
</script>

<template>
    <button>
        <p :data-title="text">{{ text }}</p>
        <svg stroke-width="4" stroke="currentColor" viewBox="0 0 24 24" fill="none" class="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg">
            <slot></slot>
        </svg>
    </button>
</template>

<style lang="scss" scoped>
button {
    padding: 0;
    margin: 0;
    border: none;
    background: none;
    transition: transform .2s;
}

button:active {
    transform: scale(0.9);
}

button {
    --primary-color: rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity));
    position: relative;
    display: flex;
    font-weight: 600;
    font-size: 20px;
    gap: 0.5rem;
    align-items: center;
}

button p {
    margin: 0;
    position: relative;
    font-size: 20px;
    color: var(--primary-color);
    transition: color .2s;
    transition-delay: .2s;
}

button::after {
    position: absolute;
    content: "";
    width: 0;
    left: 0;
    bottom: -7px;
    background: $primary;
    height: 2px;
    transition: 0.3s ease-out;
}

button p::before {
    position: absolute;
    width: 0%;
    inset: 0;
    color: $primary;
    overflow: hidden;
    transition: 0.3s ease-out;
}

button:hover::after {
    width: 100%;
}

button:hover p::before {
    width: 100%;
}

button:hover p {
    color: $primary;
}

button:hover svg {
    transform: translateX(4px);
    color: $primary
}

button svg {
    color: var(--primary-color);
    transition: 0.2s;
    position: relative;
    width: 15px;
    transition-delay: 0.2s;
}
</style>
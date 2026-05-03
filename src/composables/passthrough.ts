import type { PassThroughOptions } from "primevue/passthrough";

/**
 * Type for merge props function
 */
type MergePropsFn = (target: unknown, source: unknown) => unknown;

/**
 * Normalize class value to string
 * Handles string, array of strings, or mixed
 */
function normalizeClassValue(value: unknown): string {
  if (typeof value === "string") {
    return value.trim();
  }
  if (Array.isArray(value)) {
    return value
      .filter((v) => typeof v === "string" && v.trim())
      .map((v) => v.trim())
      .join(" ");
  }
  return "";
}

/**
 * Concatenate two class values with proper spacing
 * Used for merging CSS classes - supports strings and arrays
 */
function concatenateClasses(
  target: string | string[] | unknown,
  source: string | string[] | unknown,
): string {
  const targetStr = normalizeClassValue(target);
  const sourceStr = normalizeClassValue(source);

  if (!targetStr) return sourceStr;
  if (!sourceStr) return targetStr;

  return `${targetStr} ${sourceStr}`;
}

/**
 * Deep merge utility for passthrough objects
 * Handles nested sections and merging strategies
 */
function deepMerge<T>(
  target: T,
  source: Partial<T>,
  mergeProps?: boolean | MergePropsFn,
): T {
  if (!source) return target;
  if (!target) return source as T;

  const result = { ...target } as Record<string, unknown>;

  for (const key in source) {
    if (!Object.prototype.hasOwnProperty.call(source, key)) continue;

    const sourceValue = source[key];
    const targetValue = result[key];

    // Special case: target is string (CSS classes), source is object with nested props
    // We need to convert the string to an object with 'class' property and merge
    if (typeof targetValue === "string" && isPlainObject(sourceValue)) {
      const sourceObj = sourceValue as Record<string, unknown>;
      result[key] = {
        class:
          sourceObj.class !== undefined
            ? concatenateClasses(targetValue, sourceObj.class)
            : targetValue,
        ...sourceObj,
      };
    }
    // Special case: target is object, source is string (CSS classes to add)
    // We need to append the string to the 'class' property
    else if (isPlainObject(targetValue) && typeof sourceValue === "string") {
      const targetObj = targetValue as Record<string, unknown>;
      result[key] = {
        ...targetObj,
        class:
          targetObj.class !== undefined
            ? concatenateClasses(targetObj.class, sourceValue)
            : sourceValue,
      };
    }
    // If both values are plain objects, recursively merge them
    // Special handling for 'class' property within objects
    else if (isPlainObject(targetValue) && isPlainObject(sourceValue)) {
      const targetObj = targetValue as Record<string, unknown>;
      const sourceObj = sourceValue as Record<string, unknown>;

      // If both objects have 'class' property, concatenate them
      if (targetObj.class !== undefined && sourceObj.class !== undefined) {
        result[key] = {
          ...deepMerge(targetObj, sourceObj, mergeProps),
          class: concatenateClasses(targetObj.class, sourceObj.class),
        };
      } else {
        result[key] = deepMerge(targetObj, sourceObj, mergeProps);
      }
    }
    // If both values are strings, concatenate them with proper spacing
    else if (
      typeof targetValue === "string" &&
      typeof sourceValue === "string" &&
      targetValue !== undefined &&
      sourceValue !== undefined
    ) {
      result[key] = concatenateClasses(targetValue, sourceValue);
    }
    // If mergeProps is provided and both values exist, use it to merge
    else if (
      mergeProps &&
      targetValue !== undefined &&
      sourceValue !== undefined
    ) {
      if (typeof mergeProps === "function") {
        result[key] = mergeProps(targetValue, sourceValue);
      } else {
        // If mergeProps is true, attempt a simple merge
        result[key] = sourceValue;
      }
    }
    // Otherwise, source value overwrites target value
    else {
      result[key] = sourceValue;
    }
  }

  return result as T;
}

/**
 * Check if value is a plain object
 */
function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    value !== null &&
    typeof value === "object" &&
    Object.prototype.toString.call(value) === "[object Object]"
  );
}

/**
 * Return type for usePassthrough composable
 */
export interface UsePassthroughResult<T = Record<string, unknown>> {
  _usept?: PassThroughOptions;
  originalValue: T;
  value: T;
}

/**
 * Proper implementation of PrimeVue's usePassthrough composable
 *
 * Merges two passthrough objects with support for:
 * - mergeSections: Deep merges nested sections instead of overwriting
 * - mergeProps: Custom merge function or boolean for merging individual properties
 * - String concatenation: Automatically concatenates string values (e.g., CSS classes)
 *
 * @param pt1 - Base passthrough object (typically from theme/preset)
 * @param pt2 - Override passthrough object (typically from component props)
 * @param options - Merge options
 * @returns Merged passthrough object with metadata
 */
export function usePassThrough<
  T extends Record<string, unknown> = Record<string, unknown>,
>(
  pt1: T = {} as T,
  pt2: Partial<T> = {},
  options?: PassThroughOptions,
): UsePassthroughResult<T> {
  const { mergeSections = true, mergeProps: mergePropsFn } = options || {};

  let mergedValue: T;

  if (mergeSections) {
    // Deep merge with optional mergeProps function
    mergedValue = deepMerge(pt1, pt2, mergePropsFn) as T;
  } else {
    // Shallow merge - pt2 overwrites pt1 at top level
    mergedValue = { ...pt1, ...pt2 } as T;
  }

  return {
    _usept: options,
    originalValue: pt1,
    value: mergedValue,
  };
}

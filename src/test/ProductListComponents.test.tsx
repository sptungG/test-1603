import { fireEvent, render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { describe, expect, it, vi } from "vitest";
import { ProductFilterRangeSlider } from "../modules/product/components/ProductFilterRangeSlider";
import { ProductListContent } from "../modules/product/components/ProductListContent";
import { ProductListVirtualized } from "../modules/product/components/ProductListVirtualized";
import type { TProduct } from "../modules/product/product-types";

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

function makeProducts(count: number): TProduct[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `prod-${i}`,
    name: `Product ${i}`,
    price: 10 + i,
    rating: 3.5,
    category: "electronics" as const,
    stock: i % 3 === 0 ? 0 : 5,
    image_url: `https://picsum.photos/seed/${i}/96/96`,
  }));
}

function renderWithRouter(ui: React.ReactElement) {
  const router = createMemoryRouter(
    [{ path: "*", element: ui }],
    { initialEntries: ["/"] },
  );
  return render(<RouterProvider router={router} />);
}

// ---------------------------------------------------------------------------
// ProductListVirtualized
// ---------------------------------------------------------------------------

describe("ProductListVirtualized", () => {
  it("renders an empty-state message when there are no products", () => {
    renderWithRouter(<ProductListVirtualized products={[]} height={600} />);
    expect(screen.getByText(/no products found/i)).toBeInTheDocument();
  });

  it("renders the virtualized list container when products exist", () => {
    const products = makeProducts(5);
    const { container } = renderWithRouter(
      <ProductListVirtualized products={products} height={600} />,
    );
    // react-window renders a scrollable outer div + inner div
    expect(container.querySelector("div[style]")).toBeInTheDocument();
  });

  it("does not show empty state when products are present", () => {
    const products = makeProducts(3);
    renderWithRouter(<ProductListVirtualized products={products} height={600} />);
    expect(screen.queryByText(/no products found/i)).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// ProductListContent
// ---------------------------------------------------------------------------

describe("ProductListContent", () => {
  it("shows skeleton loaders when loading=true", () => {
    const { container } = renderWithRouter(
      <ProductListContent loading={true} products={[]} height={600} />,
    );
    // 8 skeleton rows with animate-pulse
    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons).toHaveLength(8);
  });

  it("does not show skeletons when loading=false", () => {
    const { container } = renderWithRouter(
      <ProductListContent loading={false} products={[]} height={600} />,
    );
    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons).toHaveLength(0);
  });

  it("renders the virtualized list when not loading", () => {
    const products = makeProducts(3);
    renderWithRouter(
      <ProductListContent loading={false} products={products} height={600} />,
    );
    // react-window scrollable container is present (not skeleton)
    expect(screen.queryByText(/no products found/i)).not.toBeInTheDocument();
  });

  it("shows empty state via virtualized list when products array is empty and not loading", () => {
    renderWithRouter(
      <ProductListContent loading={false} products={[]} height={600} />,
    );
    expect(screen.getByText(/no products found/i)).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// ProductFilterRangeSlider
// ---------------------------------------------------------------------------

describe("ProductFilterRangeSlider", () => {
  it("renders both range input thumbs", () => {
    const onChange = vi.fn();
    const { container } = render(
      <ProductFilterRangeSlider
        min={0}
        max={1000}
        valueMin={100}
        valueMax={800}
        onChange={onChange}
      />,
    );

    const inputs = container.querySelectorAll("input[type='range']");
    expect(inputs).toHaveLength(2);
  });

  it("renders the label and formatted value range when a label is provided", () => {
    render(
      <ProductFilterRangeSlider
        min={0}
        max={1000}
        valueMin={100}
        valueMax={800}
        onChange={vi.fn()}
        label="Price"
        formatValue={(v) => `$${v}`}
      />,
    );

    expect(screen.getByText("Price")).toBeInTheDocument();
    expect(screen.getByText("$100 – $800")).toBeInTheDocument();
  });

  it("does not render a label section when label prop is omitted", () => {
    const { container } = render(
      <ProductFilterRangeSlider
        min={0}
        max={1000}
        valueMin={0}
        valueMax={1000}
        onChange={vi.fn()}
      />,
    );

    // No span with text content for a label
    expect(container.querySelector("span.text-sm.font-medium")).not.toBeInTheDocument();
  });

  it("calls onChange with updated min value when min thumb changes", () => {
    const onChange = vi.fn();
    const { container } = render(
      <ProductFilterRangeSlider
        min={0}
        max={1000}
        valueMin={100}
        valueMax={800}
        onChange={onChange}
        step={1}
      />,
    );

    const [minInput] = container.querySelectorAll("input[type='range']");
    fireEvent.change(minInput, { target: { value: "200" } });
    expect(onChange).toHaveBeenCalledWith(200, 800);
  });

  it("calls onChange with updated max value when max thumb changes", () => {
    const onChange = vi.fn();
    const { container } = render(
      <ProductFilterRangeSlider
        min={0}
        max={1000}
        valueMin={100}
        valueMax={800}
        onChange={onChange}
        step={1}
      />,
    );

    const [, maxInput] = container.querySelectorAll("input[type='range']");
    fireEvent.change(maxInput, { target: { value: "900" } });
    expect(onChange).toHaveBeenCalledWith(100, 900);
  });

  it("clamps min thumb so it cannot exceed max - step", () => {
    const onChange = vi.fn();
    const { container } = render(
      <ProductFilterRangeSlider
        min={0}
        max={100}
        valueMin={50}
        valueMax={80}
        onChange={onChange}
        step={10}
      />,
    );

    const [minInput] = container.querySelectorAll("input[type='range']");
    // Try to set min above max (80 - step 10 = 70 is the ceiling)
    fireEvent.change(minInput, { target: { value: "90" } });
    expect(onChange).toHaveBeenCalledWith(70, 80); // clamped to valueMax - step
  });

  it("clamps max thumb so it cannot go below min + step", () => {
    const onChange = vi.fn();
    const { container } = render(
      <ProductFilterRangeSlider
        min={0}
        max={100}
        valueMin={50}
        valueMax={80}
        onChange={onChange}
        step={10}
      />,
    );

    const [, maxInput] = container.querySelectorAll("input[type='range']");
    // Try to set max below min (50 + step 10 = 60 is the floor)
    fireEvent.change(maxInput, { target: { value: "40" } });
    expect(onChange).toHaveBeenCalledWith(50, 60); // clamped to valueMin + step
  });

  it("applies aria-labels to both thumbs when label is provided", () => {
    render(
      <ProductFilterRangeSlider
        min={0}
        max={1000}
        valueMin={0}
        valueMax={1000}
        onChange={vi.fn()}
        label="Price"
      />,
    );

    expect(screen.getByLabelText("Price minimum")).toBeInTheDocument();
    expect(screen.getByLabelText("Price maximum")).toBeInTheDocument();
  });
});

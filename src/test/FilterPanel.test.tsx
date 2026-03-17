import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { FilterPanel } from "../modules/product/components/FilterPanel";
import type { TProductFilters } from "../modules/product/product-types";
import { DEFAULT_FILTERS } from "../modules/product/product-types";

const TEST_PRICE_BOUNDS = { min: 0, max: 2000 };

const defaultFilters: TProductFilters = {
  ...DEFAULT_FILTERS,
};

describe("FilterPanel", () => {
  const onChangeMock = vi.fn();
  const onResetMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  function renderPanel(filters: TProductFilters = defaultFilters) {
    return render(
      <FilterPanel
        filters={filters}
        priceBounds={TEST_PRICE_BOUNDS}
        onChange={onChangeMock}
        onReset={onResetMock}
        totalCount={10000}
        filteredCount={250}
      />,
    );
  }

  it("renders all 5 category checkboxes", () => {
    renderPanel();
    expect(screen.getByLabelText(/electronics/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/clothing/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/books/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/home/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/sports/i)).toBeInTheDocument();
  });

  it("shows correct total and filtered counts", () => {
    renderPanel();
    expect(screen.getByText(/10,000/)).toBeInTheDocument();
    expect(screen.getByText(/250/)).toBeInTheDocument();
  });

  it("calls onChange when a category is checked", () => {
    renderPanel();
    fireEvent.click(screen.getByLabelText(/electronics/i));
    expect(onChangeMock).toHaveBeenCalledWith({
      categories: ["electronics"],
    });
  });

  it("calls onChange to deselect a category when unchecked", () => {
    renderPanel({
      ...defaultFilters,
      categories: ["electronics"],
    });
    fireEvent.click(screen.getByLabelText(/electronics/i));
    expect(onChangeMock).toHaveBeenCalledWith({ categories: [] });
  });

  it("renders min rating radio buttons", () => {
    renderPanel();
    expect(screen.getByLabelText(/any rating/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/1\+ stars/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/4\+ stars/i)).toBeInTheDocument();
  });

  it("calls onChange when a rating radio is selected", () => {
    renderPanel();
    fireEvent.click(screen.getByLabelText(/3\+ stars/i));
    expect(onChangeMock).toHaveBeenCalledWith({ minRating: 3 });
  });

  it("does not show reset button when no active filters", () => {
    renderPanel(defaultFilters);
    expect(screen.queryByText(/clear all/i)).not.toBeInTheDocument();
  });

  it("shows clear all button when category filter is active", () => {
    renderPanel({ ...defaultFilters, categories: ["electronics"] });
    expect(screen.getByText(/clear all/i)).toBeInTheDocument();
  });

  it("calls onReset when clear all is clicked", () => {
    renderPanel({ ...defaultFilters, categories: ["sports"] });
    fireEvent.click(screen.getByText(/clear all/i));
    expect(onResetMock).toHaveBeenCalledOnce();
  });

  it("shows reset button when min rating is active", () => {
    renderPanel({ ...defaultFilters, minRating: 3 });
    expect(screen.getByText(/reset filters/i)).toBeInTheDocument();
  });
});

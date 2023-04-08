defmodule CredoContrib.Check.EmptyTestBlock do
  @moduledoc """
  All usages of `ExUnit.Case.test/3` should execute some code

  For unimplemented tests use `ExUnit.Case.test/1` and set
  `ExUnit.start(except: [:not_implemented])`
  """

  @explanation [
    check: @moduledoc
  ]

  use Credo.Check, base_priority: :high, category: :readability

  def run(source_file, params \\ []) do
    issue_meta = IssueMeta.for(source_file, params)
    Credo.Code.prewalk(source_file, &traverse(&1, &2, issue_meta))
  end

  defp traverse({:test, meta, [_, [do: {:__block__, [], []}]]} = ast, issues, issue_meta) do
    {ast, [issue_for(issue_meta, meta[:line]) | issues]}
  end

  defp traverse(ast, issues, _) do
    {ast, issues}
  end

  defp issue_for(issue_meta, line_no) do
    format_issue(
      issue_meta,
      message: "Test is missing body. Use `ExUnit.Case.test/1` for unimplemented tests.",
      line_no: line_no,
      trigger: :test
    )
  end
end

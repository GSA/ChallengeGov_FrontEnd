# credo:disable-for-this-file Credo.Check.Readability.ModuleDoc
import WebDriverClient.CompatibilityMacros

defmodule WebDriverClient.JSONWireProtocolClient.ServerStatus do
  prerelease_moduledoc """
  A server status response
  """

  @type t :: %__MODULE__{
          ready?: boolean
        }

  defstruct [:ready?]
end

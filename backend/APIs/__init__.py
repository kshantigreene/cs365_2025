"""Compatibility shim for `backend.apis`.

This module forwards imports to the existing `backend.APIs` package
so code can import `backend.apis` (lowercase) or `backend.APIs` (uppercase)
without changing behavior. Useful on case-insensitive filesystems.
"""
from importlib import import_module

try:
	_apis = import_module('backend.APIs')
	database_api = getattr(_apis, 'database_api')
	thomas_menu = getattr(_apis, 'thomas_menu')
except Exception:
	# If the above fails, fall back to direct imports (if present)
	try:
		from . import database_api, thomas_menu
	except Exception:
		# Leave names undefined; import errors will surface where used
		pass

__all__ = ['database_api', 'thomas_menu']
